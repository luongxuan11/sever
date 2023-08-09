import * as controllers from "../controllers";
import express from "express";
const router = express.Router();

router.get("/all", controllers.getPrices);

export default router;
