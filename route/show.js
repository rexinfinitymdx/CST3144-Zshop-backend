const express = require("express");
const router = express.Router();

// Define the /products route
router.get("/products", async (req, res) => {
  try {
    const db = req.dbClient.db("webstore"); // Use the webstore database
    const collection = db.collection("products"); // Access the products collection
    const products = await collection.find({}).toArray(); // Fetch all documents
    res.status(200).json(products); // Send products as JSON response
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router; // Export the router
