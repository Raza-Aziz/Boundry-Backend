import express, { json, urlencoded } from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

connectDb();

// To handle JSON values in request body
app.use(express.json());
// To handle forms
app.use(express.urlencoded({ extended: true }));
// To handle cookies
app.use(cookieParser());

// TODO: To handle user routes

app.get("/", (req, res) => res.send("Hello World"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
