import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

connectDb();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://boundry.netlify.app", "https://boundry.vercel.app"],
    credentials: true,
  }),
);

// To handle JSON values in request body
app.use(express.json());
// To handle forms
app.use(express.urlencoded({ extended: true }));
// To handle cookies
app.use(cookieParser());

// handles user routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("Hello World"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
