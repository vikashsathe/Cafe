import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function Menu() {
  const [params] = useSearchParams();
  const tableId = params.get("tableId");

  const [cart, setCart] = useState([]);

  // Static menu (later DB se la sakte ho)
  const menuItems = [
    { name: "Coffee", price: 100 },
    { name: "Tea", price: 50 },
    { name: "Burger", price: 150 },
  ];

  useEffect(() => {
    if (!tableId) return;

    socket.emit("joinTable", tableId);

    socket.on("orderConfirmed", () => {
      alert("Order Confirmed ✅");
    });

    return () => socket.off("orderConfirmed");
  }, [tableId]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Please select items");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    await axios.post("http://localhost:5001/api/order", {
      tableId,
      items: cart,
      total,
    });

    alert("Order Placed ☕");
    setCart([]);
  };

  return (
    <div>
      <h2>Table: {tableId}</h2>

      <h3>Menu</h3>
      {menuItems.map((item) => (
        <div key={item.name}>
          <p>
            {item.name} - ₹{item.price}
          </p>
          <button onClick={() => addToCart(item)}>
            Add
          </button>
        </div>
      ))}

      <h3>Cart</h3>
      {cart.map((item) => (
        <p key={item.name}>
          {item.name} x {item.qty}
        </p>
      ))}

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>

  );
}

export default Menu;