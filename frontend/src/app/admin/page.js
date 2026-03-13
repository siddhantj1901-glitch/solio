"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const res = await fetch("/api/orders", { headers: { "x-admin-password": password } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
      setAuthed(true);
    } else {
      setError("Wrong password");
    }
    setLoading(false);
  };

  if (!authed) return (
    <div className="max-w-sm mx-auto px-6 py-32 text-center">
      <p className="text-3xl mb-6">🔐</p>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Admin Panel</h1>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && login()}
        className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 mb-3"
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button onClick={login} disabled={loading} className="btn-primary w-full">{loading ? "Checking..." : "Login"}</button>
    </div>
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const paidOrders = orders.filter(o => o.payment_status === "paid").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Orders</h1>
        <button onClick={() => { setAuthed(false); setOrders([]); }} className="text-sm text-stone-500 hover:text-stone-700">Logout</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-stone-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Paid Orders</p>
          <p className="text-3xl font-bold text-emerald-600">{paidOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-stone-900">&#8377;{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-stone-400">No orders yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "City", "Payment", "Date"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-indigo-600 font-semibold">{o.order_id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-stone-900">{o.customer_name}</p>
                    <p className="text-stone-400 text-xs">{o.customer_phone}</p>
                  </td>
                  <td className="px-5 py-3 text-stone-500">{o.items?.length} item(s)</td>
                  <td className="px-5 py-3 font-bold text-stone-900">&#8377;{o.total?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-stone-500">{o.city}, {o.state}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${o.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-stone-400 text-xs">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
