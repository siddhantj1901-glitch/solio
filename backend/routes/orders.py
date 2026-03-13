import json
import uuid
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
from database.db import insert_row, fetch_all, update_row
from config import ADMIN_PASSWORD

router = APIRouter(prefix="/orders", tags=["orders"])

class OrderItem(BaseModel):
    product_id: int
    product_name: str
    color: str
    size: int
    quantity: int
    price: int

class CreateOrderRequest(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    address_line: str
    city: str
    state: str
    pincode: str
    items: List[OrderItem]
    subtotal: int
    shipping: int
    total: int
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None

@router.post("")
def create_order(req: CreateOrderRequest):
    order_id = f"SOL{str(uuid.uuid4())[:8].upper()}"
    data = {
        "order_id": order_id,
        "razorpay_order_id": req.razorpay_order_id or "",
        "razorpay_payment_id": req.razorpay_payment_id or "",
        "customer_name": req.customer_name,
        "customer_email": req.customer_email,
        "customer_phone": req.customer_phone,
        "address_line": req.address_line,
        "city": req.city,
        "state": req.state,
        "pincode": req.pincode,
        "items": json.dumps([item.dict() for item in req.items]),
        "subtotal": req.subtotal,
        "shipping": req.shipping,
        "total": req.total,
        "status": "confirmed" if req.razorpay_payment_id else "pending",
        "payment_status": "paid" if req.razorpay_payment_id else "pending",
    }
    insert_row("orders", data)
    return {"order_id": order_id, "status": "confirmed"}

@router.get("")
def get_orders(x_admin_password: Optional[str] = Header(None)):
    if x_admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    orders = fetch_all("orders")
    for o in orders:
        o["items"] = json.loads(o.get("items", "[]"))
    return orders

@router.get("/{order_id}")
def get_order(order_id: str):
    from database.db import fetch_by
    order = fetch_by("orders", "order_id", order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order["items"] = json.loads(order.get("items", "[]"))
    return order
