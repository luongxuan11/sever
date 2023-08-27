import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./src/config/connectDB";
dotenv.config();

import initRouter from "./src/routes";
const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRouter(app);

const port = process.env.PORT || 3001;

const listener = app.listen(port, () => {
  console.log(`sever's running on the port ${listener.address().port}`);
});
