import mongoose from "mongoose";

const connectDB = async () => {
  // prefer explicit env var, fall back to localhost
  const baseUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    "mongodb://127.0.0.1:27017";
  const dbName = process.env.MONGODB_DB || "mern-auth";
  const uri = baseUri.endsWith("/")
    ? `${baseUri}${dbName}`
    : `${baseUri}/${dbName}`;

  mongoose.connection.on("connected", () => console.log("Database Connected"));
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB connection error:", err)
  );

  // avoid strictQuery deprecation warnings
  try {
    mongoose.set("strictQuery", true);
    // modern driver no longer needs these options
    await mongoose.connect(uri);
    console.log("Connected to MongoDB at", uri);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    throw err;
  }
};

export default connectDB;
