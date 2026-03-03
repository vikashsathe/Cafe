import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function Admin() {

  // -------- TABLE STATE --------
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");

  // -------- ORDER STATE --------
  const [orders, setOrders] = useState([]);

  const baseURL = "http://localhost:5173";

  useEffect(() => {
    loadTables();
    loadOrders();

    socket.emit("joinAdmin");

    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    return () => socket.off("newOrder");

  }, []);

  // ================= TABLE FUNCTIONS =================

  const loadTables = async () => {
    const res = await axios.get("http://localhost:5001/api/tables");
    setTables(res.data);
  };

  const addTable = async () => {
    if (!newTable) return;
    await axios.post("http://localhost:5001/api/tables", {
      tableNumber: newTable,
    });
    setNewTable("");
    loadTables();
  };

  const deleteTable = async (id) => {
    await axios.delete(`http://localhost:5001/api/tables/${id}`);
    loadTables();
  };

  // ================= ORDER FUNCTIONS =================

  const loadOrders = async () => {
    const res = await axios.get("http://localhost:5001/api/orders");
    setOrders(res.data);
  };

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

      <h2>Manage Tables</h2>

      <input
        value={newTable}
        onChange={(e) => setNewTable(e.target.value)}
        placeholder="Enter Table Name (T5)"
      />
      <button onClick={addTable}>Add Table</button>

      <hr />

      {tables.map((table) => {
        const qrURL = `${baseURL}/order?tableId=${table.tableNumber}`;

        return (
          <div key={table._id} style={{ marginBottom: 20 }}>
            <h4>{table.tableNumber}</h4>
            <QRCodeCanvas value={qrURL} size={120} />
            <br />
            <button onClick={() => deleteTable(table._id)}>
              Delete
            </button>
          </div>
        );
      })}

      <hr />
      <h2>Orders</h2>

      {orders.map(o => (
        <div key={o._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>

          <p><strong>Table:</strong> {o.tableId}</p>
          <p><strong>Status:</strong> {o.status}</p>

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