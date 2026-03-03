const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Order = require("./models/Order");

mongoose.connect("mongodb://127.0.0.1:27017/cafe")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {

  socket.on("joinTable", (tableId) => {
    socket.join(tableId);
  });

  socket.on("joinAdmin", () => {
    socket.join("admin");
  });

});


// 🔹 Create Order
app.post("/api/order", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    io.to("admin").emit("newOrder", order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});


// 🔹 Confirm Order
app.put("/api/order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    io.to(order.tableId).emit("orderConfirmed", order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});


// 🔹 Get All Orders (Admin reload support)
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

server.listen(5001, () =>
  console.log("Server running on port 5001")
);