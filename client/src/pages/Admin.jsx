import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.emit("joinAdmin");

    // load old orders
    axios.get("http://localhost:5001/api/orders")
      .then(res => setOrders(res.data));

    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    return () => socket.off("newOrder");
  }, []);

  const confirmOrder = async (id) => {
    await axios.put(`http://localhost:5001/api/order/${id}`);

    setOrders(prev =>
      prev.map(o =>
        o._id === id ? { ...o, status: "confirmed" } : o
      )
    );
  };

  return (
    <div>
      <h2>Admin Panel</h2>

     {orders.map(o => (
  <div key={o._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
    
    <p><strong>Table:</strong> {o.tableId}</p>
    <p><strong>Status:</strong> {o.status}</p>

    <h4>Items:</h4>
    {o.items.map((item, index) => (
      <p key={index}>
        {item.name} x {item.qty} - ₹{item.price}
      </p>
    ))}

    <p><strong>Total:</strong> ₹{o.total}</p>

    {o.status === "pending" && (
      <button onClick={() => confirmOrder(o._id)}>
        Confirm
      </button>
    )}

  </div>
))}
    </div>
  );
}

export default Admin;