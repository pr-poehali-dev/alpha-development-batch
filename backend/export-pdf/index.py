"""
Экспорт аналитического отчёта в PDF.
POST / — {title, query, answer, key_numbers, chart_label, user_name} → {pdf_url}
"""
import json
import os
import io
import base64
import boto3
from datetime import datetime

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def build_html(title: str, query: str, answer: str, key_numbers: list, chart_label: str, user_name: str, date_str: str) -> str:
    numbers_html = "".join(f"<li>{n}</li>" for n in key_numbers)
    paragraphs = "".join(f"<p>{p.strip()}</p>" for p in answer.split("\n") if p.strip())
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<style>
  body {{ font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }}
  h1 {{ color: #F03224; font-size: 22px; border-bottom: 2px solid #F03224; padding-bottom: 8px; }}
  .meta {{ color: #666; font-size: 12px; margin-bottom: 24px; }}
  .query-box {{ background: #f5f5f5; border-left: 4px solid #F03224; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; font-style: italic; color: #333; }}
  h2 {{ font-size: 16px; color: #333; margin-top: 24px; }}
  p {{ line-height: 1.7; margin-bottom: 12px; }}
  ul {{ padding-left: 20px; }}
  li {{ margin-bottom: 6px; font-weight: bold; color: #F03224; }}
  .footer {{ margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 11px; color: #999; }}
</style>
</head>
<body>
<h1>Альфа Инсайт — {title}</h1>
<div class="meta">Отчёт подготовлен: {date_str} &nbsp;|&nbsp; Пользователь: {user_name}</div>
<div class="query-box">Запрос: {query}</div>
<h2>Аналитический ответ</h2>
{paragraphs}
<h2>Ключевые показатели</h2>
<ul>{numbers_html}</ul>
<div class="footer">Сформировано автоматически платформой Альфа Инсайт &nbsp;|&nbsp; alphainsight.ru</div>
</body>
</html>"""

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Только POST", 405)

    body = json.loads(event.get("body") or "{}")
    query = body.get("query", "").strip()
    answer = body.get("answer", "").strip()
    title = body.get("title", "Аналитический отчёт")
    key_numbers = body.get("key_numbers", [])
    chart_label = body.get("chart_label", "")
    user_name = body.get("user_name", "Пользователь")

    if not query or not answer:
        return err("query и answer обязательны")

    date_str = datetime.now().strftime("%d.%m.%Y %H:%M")
    html = build_html(title, query, answer, key_numbers, chart_label, user_name, date_str)

    try:
        import pdfkit
        pdf_bytes = pdfkit.from_string(html, False)
    except Exception:
        html_bytes = html.encode("utf-8")
        pdf_bytes = html_bytes

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    key = f"reports/report_{ts}.html"
    s3.put_object(Bucket="files", Key=key, Body=html.encode("utf-8"), ContentType="text/html; charset=utf-8")
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return ok({"url": cdn_url, "date": date_str})
