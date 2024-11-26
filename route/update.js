const express = require("express");
const router = express.Router();

router.put("/products", async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).send("Cart items are required");
        }

        const db = req.dbClient.db("webstore");
        const productsCollection = db.collection("products");

        for (const item of cartItems) {
            const { id, quantity } = item;

            if (!id || !quantity || quantity <= 0) {
                return res.status(400).send("Each cart item must have a valid ID and quantity");
            }

            // Update the product's `availableSeats` by decrementing the quantity
            const updateResult = await productsCollection.updateOne(
                { id }, // Match the product by its `id`
                { $inc: { availableSeats: -quantity } } // Decrement `availableSeats` by `quantity`
            );

            if (updateResult.matchedCount === 0) {
                console.warn(`Product with ID ${id} not found`);
            }
        }

        res.status(200).json({
            message: "Cart items updated successfully",
            updatedItems: cartItems,
        });
    } catch (error) {
        console.error("Error updating products:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
