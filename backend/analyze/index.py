"""
AI-анализ запросов на естественном языке для Альфа Инсайт.
POST / — {query: str, user_id?: int} → {answer: str, chart_data?: list}
GET  /history?user_id=X — история запросов пользователя
"""
import json
import os
import psycopg2
from openai import OpenAI

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

SYSTEM_PROMPT = """Ты аналитический ИИ-ассистент корпоративной платформы «Альфа Инсайт».
Отвечай на русском языке. Анализируй бизнес-запросы: прогнозы, риски, клиенты, регионы, финансы.
Структурируй ответ: 2-4 абзаца, ключевые цифры выдели в JSON поле key_numbers как массив строк.
Отвечай ТОЛЬКО в формате JSON: {"answer": "...", "key_numbers": ["..."], "chart_label": "..."}"""

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    if method == "GET" and "/history" in path:
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")
        if not user_id:
            return err("user_id обязателен", 400)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, query_text, result_text, created_at FROM query_history WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
            (int(user_id),)
        )
        rows = cur.fetchall()
        history = [{"id": r[0], "query": r[1], "result": r[2], "created_at": str(r[3])} for r in rows]
        return ok({"history": history})

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        query = body.get("query", "").strip()
        user_id = body.get("user_id")
        if not query:
            return err("query обязателен")

        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        raw = response.choices[0].message.content
        result = json.loads(raw)
        answer = result.get("answer", "")
        key_numbers = result.get("key_numbers", [])
        chart_label = result.get("chart_label", "Динамика")

        if user_id:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO query_history (user_id, query_text, result_text) VALUES (%s, %s, %s)",
                (int(user_id), query, answer)
            )
            conn.commit()

        return ok({
            "answer": answer,
            "key_numbers": key_numbers,
            "chart_label": chart_label
        })

    return err("Не найдено", 404)
