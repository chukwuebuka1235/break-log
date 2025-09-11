import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client;
let clientPromise;

try {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error("MongoDB connection error:", error);
  throw new Error("Failed to connect to MongoDB");
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("breaklog");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Database connection error");
  }
}

export default clientPromise;
