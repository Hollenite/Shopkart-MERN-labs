import dotenv from 'dotenv';
import mongoose from 'mongoose';

const connectDB = async () => {
    dotenv.config()

    try {
        await mongoose.connect(process.env.URL);
        console.log("DB connected")
    } catch (error) {
        console.error("Error connecting to DB", error)
    }
}

export default connectDB;