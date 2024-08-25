import mongoose, { ConnectOptions, Mongoose } from "mongoose";

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let cachedClient: Mongoose | null = null;

mongoose.set("strictQuery", true);

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connectToDatabase(): Promise<Mongoose> {
  if (cachedClient) {
    return cachedClient;
  }
  try {
    const client: Mongoose = await mongoose.connect(
      uri as string,
      connectionParams as ConnectOptions
    );

    cachedClient = client;
    return client;
  } catch (err) {
    console.error(`Failed to connect to the database: ${err}`);
    throw err;
  }
}
