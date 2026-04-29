"""
Авторизация: регистрация и вход для пользователей Альфа Инсайт.
POST / — {action: "register"|"login"|"me", ...}
"""
import json
import os
import hashlib
import secrets
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def make_token(user_id: int) -> str:
    return f"{user_id}:{secrets.token_hex(32)}"

def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")
    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        name = body.get("name", "").strip()
        if not email or not password or not name:
            return err("email, password и name обязательны")
        try:
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                (email, hash_password(password), name)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            token = make_token(user_id)
            return ok({"token": token, "user": {"id": user_id, "email": email, "name": name}}, 201)
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return err("Пользователь с таким email уже существует", 409)

    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        cur.execute("SELECT id, name FROM users WHERE email = %s AND password_hash = %s", (email, hash_password(password)))
        row = cur.fetchone()
        if not row:
            return err("Неверный email или пароль", 401)
        user_id, name = row
        token = make_token(user_id)
        return ok({"token": token, "user": {"id": user_id, "email": email, "name": name}})

    if action == "me":
        token = body.get("token", "")
        if not token or ":" not in token:
            return err("Токен не передан", 401)
        user_id = int(token.split(":")[0])
        cur.execute("SELECT id, email, name FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            return err("Пользователь не найден", 404)
        return ok({"user": {"id": row[0], "email": row[1], "name": row[2]}})

    return err("Неизвестное действие", 400)
