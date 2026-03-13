import sqlite3
import os
import json
from database.schema import CREATE_TABLES_SQL
from config import DATABASE_URL

def get_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    try:
        for stmt in CREATE_TABLES_SQL.strip().split(";"):
            s = stmt.strip()
            if s:
                conn.execute(s)
        conn.commit()
        _seed_products()
    finally:
        conn.close()

def _seed_products():
    conn = get_connection()
    try:
        existing = conn.execute("SELECT COUNT(*) as c FROM products").fetchone()["c"]
        if existing > 0:
            return
        conn.execute("""
            INSERT INTO products (name, slug, tagline, description, price, original_price, colors, sizes, in_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Solio Everyday Sandal",
            "solio-everyday-sandal",
            "Walk Like You Mean It",
            "Engineered for all-day comfort. Contoured EVA footbed with arch support, adjustable straps, and anti-slip rubber outsole. Office to weekend — one sandal.",
            1299,
            1799,
            json.dumps([
                {"name": "Midnight Black", "hex": "#1a1a1a"},
                {"name": "Sand Beige", "hex": "#c8a882"},
                {"name": "Olive Green", "hex": "#6b7c4a"}
            ]),
            json.dumps([5, 6, 7, 8, 9, 10, 11]),
            1
        ))
        conn.commit()
    finally:
        conn.close()

def fetch_all(table):
    conn = get_connection()
    try:
        return [dict(r) for r in conn.execute(f"SELECT * FROM {table} ORDER BY id DESC").fetchall()]
    finally:
        conn.close()

def fetch_by(table, field, value):
    conn = get_connection()
    try:
        row = conn.execute(f"SELECT * FROM {table} WHERE {field} = ?", (value,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def insert_row(table, data):
    conn = get_connection()
    try:
        cols = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        cur = conn.execute(f"INSERT INTO {table} ({cols}) VALUES ({placeholders})", list(data.values()))
        conn.commit()
        return cur.lastrowid
    finally:
        conn.close()

def update_row(table, data, field, value):
    conn = get_connection()
    try:
        sets = ", ".join([f"{k} = ?" for k in data.keys()])
        conn.execute(f"UPDATE {table} SET {sets} WHERE {field} = ?", list(data.values()) + [value])
        conn.commit()
    finally:
        conn.close()
