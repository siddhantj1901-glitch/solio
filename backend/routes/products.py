import json
from fastapi import APIRouter
from database.db import fetch_all, fetch_by

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
def get_products():
    products = fetch_all("products")
    for p in products:
        p["colors"] = json.loads(p.get("colors", "[]"))
        p["sizes"] = json.loads(p.get("sizes", "[]"))
    return products

@router.get("/{slug}")
def get_product(slug: str):
    product = fetch_by("products", "slug", slug)
    if not product:
        return {"error": "Product not found"}
    product["colors"] = json.loads(product.get("colors", "[]"))
    product["sizes"] = json.loads(product.get("sizes", "[]"))
    return product
