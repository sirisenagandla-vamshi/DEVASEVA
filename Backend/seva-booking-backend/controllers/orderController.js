// controllers/orderController.js
const orderModel = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { user_id, items, address, amounttopay, paymentid } = req.body;

    if (!user_id || !items || !address || !amounttopay || !paymentid) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const newOrder = await orderModel.createOrder({
      user_id,
      items,
      address,
      amounttopay,
      paymentid,
    });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = {
  createOrder,
};
