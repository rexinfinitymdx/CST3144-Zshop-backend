const express = require("express");
const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const db = req.dbClient.db("webstore");
    const collection = db.collection("products");

    const { search } = req.query;
    let products;

    if (search) {
      console.log("Search query parameter:", search);

      const searchAsNumber = parseFloat(search);

      // Queries
      const textSearchQuery = { $text: { $search: search } };
      const otherConditionsQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          ...(isNaN(searchAsNumber)
            ? []
            : [
                { price: searchAsNumber },
                { availableSeats: searchAsNumber },
              ]),
        ],
      };

      // Run queries separately
      const textSearchResults = await collection.find(textSearchQuery).toArray();
      const otherResults = await collection.find(otherConditionsQuery).toArray();

      // Merge results and remove duplicates
      const allResults = [...textSearchResults, ...otherResults];
      products = Array.from(new Map(allResults.map(item => [item._id.toString(), item])).values());
    } else {
      // Fetch all documents if no search query is provided
      products = await collection.find({}).toArray();
    }

    res.status(200).json(products); // Send products as JSON response
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// New route to handle /products/search/:search
router.get("/products/search/:search", async (req, res) => {
  try {
    const { search } = req.params; // Get the search parameter from the route
    const db = req.dbClient.db("webstore");
    const collection = db.collection("products");

    console.log("Search parameter:", search);

    const searchAsNumber = parseFloat(search);

    // Queries
    const textSearchQuery = { $text: { $search: search } };
    const otherConditionsQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        ...(isNaN(searchAsNumber)
          ? []
          : [
              { price: searchAsNumber },
              { availableSeats: searchAsNumber },
            ]),
      ],
    };

    // Run queries separately
    const textSearchResults = await collection.find(textSearchQuery).toArray();
    const otherResults = await collection.find(otherConditionsQuery).toArray();

    // Merge results and remove duplicates
    const allResults = [...textSearchResults, ...otherResults];
    const products = Array.from(new Map(allResults.map(item => [item._id.toString(), item])).values());

    res.status(200).json(products); // Send products as JSON response
  } catch (error) {
    console.error("Error searching products:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
