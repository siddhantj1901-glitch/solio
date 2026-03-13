"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("solio_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("solio_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const key = `${item.product_id}-${item.color}-${item.size}`;
      const existing = prev.find(i => `${i.product_id}-${i.color}-${i.size}` === key);
      if (existing) {
        return prev.map(i => `${i.product_id}-${i.color}-${i.size}` === key
          ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));

  const updateQuantity = (index, qty) => {
    if (qty < 1) return removeFromCart(index);
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
