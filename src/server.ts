import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import logger from "./utils/logger";
import usersRouter from "./routes/usersRouter";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//register public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(204).end(); // No content
});
app.set("json spaces", 2);

app.use("/v1/users", usersRouter);

app.get("/v1", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Run server
app.listen(PORT, () => {
  logger.info(`🚀 ExpressJS Supabase API Starter running on port ${PORT}`);
  console.log(`🚀 ExpressJS Supabase API Starter running on port ${PORT}`);
});
