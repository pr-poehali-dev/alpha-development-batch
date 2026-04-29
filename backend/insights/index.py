"""
Управление сохранёнными инсайтами пользователя.
GET    /?user_id=X       — список инсайтов
POST   /                 — {user_id, text} создать инсайт
PUT    /{id}             — {text} обновить инсайт
DELETE /{id}?user_id=X  — удалить инсайт
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

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
    params = event.get("queryStringParameters") or {}
    body = json.loads(event.get("body") or "{}")
    conn = get_conn()
    cur = conn.cursor()

    path_parts = [p for p in path.strip("/").split("/") if p]
    insight_id = int(path_parts[-1]) if path_parts and path_parts[-1].isdigit() else None

    if method == "GET":
        user_id = params.get("user_id")
        if not user_id:
            return err("user_id обязателен")
        cur.execute("SELECT id, text, position FROM saved_insights WHERE user_id = %s ORDER BY position, created_at", (int(user_id),))
        rows = cur.fetchall()
        return ok({"insights": [{"id": r[0], "text": r[1], "position": r[2]} for r in rows]})

    if method == "POST":
        user_id = body.get("user_id")
        text = body.get("text", "").strip()
        if not user_id or not text:
            return err("user_id и text обязательны")
        cur.execute("INSERT INTO saved_insights (user_id, text) VALUES (%s, %s) RETURNING id", (int(user_id), text))
        new_id = cur.fetchone()[0]
        conn.commit()
        return ok({"id": new_id, "text": text}, 201)

    if method == "PUT" and insight_id:
        text = body.get("text", "").strip()
        if not text:
            return err("text обязателен")
        cur.execute("UPDATE saved_insights SET text = %s WHERE id = %s", (text, insight_id))
        conn.commit()
        return ok({"id": insight_id, "text": text})

    if method == "DELETE" and insight_id:
        cur.execute("DELETE FROM saved_insights WHERE id = %s", (insight_id,))
        conn.commit()
        return ok({"deleted": insight_id})

    return err("Не найдено", 404)
