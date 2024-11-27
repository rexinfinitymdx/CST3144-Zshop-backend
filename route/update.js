const express = require("express");
const router = express.Router();

router.put("/products", async (req, res) => {
    try {
        const { updateItems } = req.body;

        // Validate that updateItems exists and is an array
        if (!updateItems || !Array.isArray(updateItems) || updateItems.length === 0) {
            return res.status(400).send("updateItems is required and must be a non-empty array");
        }

        const db = req.dbClient.db("webstore");
        const productsCollection = db.collection("products");

        for (const item of updateItems) {
            const { id, availableSeats } = item;

            // Validate the required fields for each item
            if (!id || availableSeats == null || availableSeats < 0) {
                return res
                    .status(400)
                    .send("Each update item must have a valid ID and availableSeats value");
            }

            // Update the product's `availableSeats` to the new value
            const updateResult = await productsCollection.updateOne(
                { id }, // Match the product by its `id`
                { $set: { availableSeats } } // Update `availableSeats`
            );

            if (updateResult.matchedCount === 0) {
                console.warn(`Product with ID ${id} not found`);
            }
        }

        res.status(200).json({
            message: "Products updated successfully",
            updatedItems: updateItems,
        });
    } catch (error) {
        console.error("Error updating products:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
