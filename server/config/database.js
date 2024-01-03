import mongoose from "mongoose";

export const connectDB = async () => {
  
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB is connected with ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
  
};
