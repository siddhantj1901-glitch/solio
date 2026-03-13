import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from routes.products import router as products_router
from routes.orders import router as orders_router
from routes.payments import router as payments_router
from config import APP_PORT, RAZORPAY_KEY_ID

app = FastAPI(title="Solio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(products_router)
app.include_router(orders_router)
app.include_router(payments_router)

@app.get("/")
def root():
    return {
        "brand": "Solio",
        "status": "running",
        "razorpay_configured": bool(RAZORPAY_KEY_ID)
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=APP_PORT, reload=True)
