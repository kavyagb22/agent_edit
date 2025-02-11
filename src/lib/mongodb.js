import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MongoDB Environment variable");
}

export async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected`);
    return client.db();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
