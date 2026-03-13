"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`).then(r => r.json()).then(setOrder).catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">✓</span>
      </div>
      <h1 className="text-3xl font-bold text-stone-900 mb-3">Order Confirmed!</h1>
      <p className="text-stone-500 mb-2">Thank you for shopping with Solio.</p>
      {orderId && <p className="text-sm font-mono bg-stone-100 inline-block px-4 py-2 rounded-full text-stone-700 mb-6">Order ID: {orderId}</p>}

      {order && (
        <div className="bg-white rounded-2xl p-6 text-left shadow-sm mb-8">
          <h3 className="font-bold text-stone-900 mb-4">Order Details</h3>
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between"><span>Customer</span><span className="font-medium text-stone-900">{order.customer_name}</span></div>
            <div className="flex justify-between"><span>Delivery to</span><span className="font-medium text-stone-900">{order.city}, {order.state}</span></div>
            <div className="flex justify-between"><span>Total Paid</span><span className="font-bold text-stone-900">&#8377;{order.total?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-emerald-600 font-semibold capitalize">{order.status}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400">A confirmation will be sent to {order.customer_email}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-stone-500">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
