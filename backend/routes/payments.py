import json
import hmac
import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

router = APIRouter(prefix="/payments", tags=["payments"])

class CreateOrderRequest(BaseModel):
    amount: int  # in paise

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_razorpay_order(req: CreateOrderRequest):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        # Demo mode — return a fake order ID
        return {
            "id": f"demo_order_{req.amount}",
            "amount": req.amount,
            "currency": "INR",
            "demo_mode": True
        }
    try:
        import razorpay
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        order = client.order.create({
            "amount": req.amount,
            "currency": "INR",
            "payment_capture": 1
        })
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(req: VerifyPaymentRequest):
    if not RAZORPAY_KEY_SECRET:
        return {"verified": True, "demo": True}
    try:
        body = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
        expected = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()
        if expected == req.razorpay_signature:
            return {"verified": True}
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
