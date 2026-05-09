import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import connectDB from "./config/db.js";

import "./config/redis.js";

import elasticClient from "./config/elasticsearch.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    try {
        await elasticClient.info();
        console.log("Elasticsearch Connected");
    } catch (error) {
        console.error("Elasticsearch Connection Failed");
    }

    console.log("Elasticsearch Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
  }
};

startServer();