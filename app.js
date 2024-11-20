const express = require("express");
const propertiesReader = require("properties-reader");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

// CORS Middleware (to handle CORS issues)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  next();
});

// Load properties from db.properties
const propertiesPath = path.resolve(__dirname, "conf/db.properties");
const properties = propertiesReader(propertiesPath);

// Extract properties
const dbPrefix = properties.get("db.prefix");
const dbUser = encodeURIComponent(properties.get("db.user"));
const dbPassword = encodeURIComponent(properties.get("db.pwd"));
const dbUrl = properties.get("db.dbUrl");
const dbParams = properties.get("db.params");

// Construct MongoDB URI 
const uri = `${dbPrefix}${dbUser}:${dbPassword}${dbUrl}${dbParams}`;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
    strict: false, // Allow text index creation dynamically
  },
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db("webstore"); // Connect to your database

    await client.db("admin").command({ ping: 1 }); // Ping to verify connection
    console.log("Connected to MongoDB successfully and text index created!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if connection fails
  }
}


// Middleware to attach MongoDB client to requests
app.use((req, res, next) => {
  req.dbClient = client; // Attach MongoDB client to the request object
  next();
});

// Import routes + search 
const showRoutes = require("./route/show");
app.use("/show", showRoutes); // Mount the show routes under /show

app.use(express.json());

const storeRoutes = require("./route/store");
app.use("/store", storeRoutes); // Mount the store routes under /store

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToMongoDB(); // Connect to MongoDB when server starts
});
