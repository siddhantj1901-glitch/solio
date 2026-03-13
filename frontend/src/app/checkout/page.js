"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartProvider";

const INDIAN_STATES = ["Andhra Pradesh","Delhi","Gujarat","Karnataka","Kerala","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal","Other"];

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const shipping = total >= 999 ? 0 : 99;
  const finalTotal = total + shipping;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter valid 10-digit mobile number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "Enter valid 6-digit pincode";
    return e;
  };

  const handlePayment = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);

    try {
      // Create Razorpay order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal * 100 })
      });
      const razorpayOrder = await orderRes.json();

      if (razorpayOrder.demo_mode) {
        // Demo mode — skip payment, create order directly
        await placeOrder(null, null, razorpayOrder.id);
        return;
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Solio",
          description: "Comfort Sandals",
          order_id: razorpayOrder.id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#1c1917" },
          handler: async (response) => {
            // Verify payment
            await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });
            await placeOrder(razorpayOrder.id, response.razorpay_payment_id);
          },
          modal: { ondismiss: () => setLoading(false) }
        };
        new window.Razorpay(options).open();
      };
    } catch (err) {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const placeOrder = async (razorpayOrderId, razorpayPaymentId) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          address_line: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          items: cart,
          subtotal: total,
          shipping,
          total: finalTotal,
          razorpay_order_id: razorpayOrderId || "",
          razorpay_payment_id: razorpayPaymentId || "",
        })
      });
      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation?order_id=${data.order_id}`);
    } catch {
      setLoading(false);
      alert("Order placement failed. Please try again.");
    }
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="text-sm font-medium text-stone-700 block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: "" })); }}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors[name] ? "border-red-400 focus:border-red-500" : "border-stone-300 focus:border-stone-900"}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <p className="text-stone-500 mb-4">Your cart is empty.</p>
      <a href="/shop" className="btn-primary">Shop Now</a>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-stone-900 mb-4">Delivery Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Full Name" name="name" placeholder="Rahul Sharma" /></div>
              <Field label="Email" name="email" type="email" placeholder="rahul@email.com" />
              <Field label="Phone" name="phone" placeholder="9876543210" />
              <div className="col-span-2"><Field label="Address" name="address" placeholder="Flat 4B, Green Apartments, MG Road" /></div>
              <Field label="City" name="city" placeholder="Bengaluru" />
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">State</label>
                <select
                  value={form.state}
                  onChange={e => { setForm(p => ({ ...p, state: e.target.value })); setErrors(p => ({ ...p, state: "" })); }}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none bg-white transition-all ${errors.state ? "border-red-400" : "border-stone-300 focus:border-stone-900"}`}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <Field label="Pincode" name="pincode" placeholder="560001" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-stone-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-stone-600">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>&#8377;{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>&#8377;{total.toLocaleString()}</span></div>
                <div className="flex justify-between text-stone-600"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-bold text-stone-900 text-base pt-1 border-t border-stone-200"><span>Total</span><span>&#8377;{finalTotal.toLocaleString()}</span></div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : `Pay ₹${finalTotal.toLocaleString()}`}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3">Secured by Razorpay · UPI · Cards · Netbanking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
