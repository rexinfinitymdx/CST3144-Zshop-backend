const express = require("express");
const router = express.Router();

router.post("/orders", async (req, res) => {
    try {
        console.log("Request body:", req.body); // Log the incoming data

        const { orderDetails, cartItems } = req.body;

        if (!orderDetails || !cartItems) {
            return res.status(400).send("Order data is required");
        }

        const db = req.dbClient.db("webstore");
        const ordersCollection = db.collection("orders");

        // Create the order
        const order = {
            orderDetails,
            cartItems,
            orderDate: new Date(),
            status: "Pending",
        };

        const result = await ordersCollection.insertOne(order);

        res.status(201).json({
            message: "Order created successfully",
            orderId: result.insertedId,
        });
    } catch (error) {
        console.error("Error storing order:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
