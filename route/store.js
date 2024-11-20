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
        const productsCollection = db.collection("products");

        // Create the order
        const order = {
            orderDetails,
            cartItems,
            orderDate: new Date(),
            status: "Pending",
        };

        const result = await ordersCollection.insertOne(order);

        // Update availableSeats in the products collection
        for (const item of cartItems) {
            const { id, quantity } = item;
        
            // Update the product's availableSeats by decrementing it
            const updateResult = await productsCollection.updateOne(
                { id: id }, // Match the product by its custom `id` field
                { $inc: { availableSeats: -quantity } } // Decrement availableSeats by quantity
            );
        
            if (updateResult.matchedCount === 0) {
                console.warn(`Product with ID ${id} not found`);
            }
        }
        

        res.status(201).json({
            message: "Order created successfully and products updated",
            orderId: result.insertedId,
        });
    } catch (error) {
        console.error("Error storing order or updating products:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
