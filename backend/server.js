import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
import customerRoutes from "./routes/customer.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const PORT = process.env.PORT;

await connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/customers", customerRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
