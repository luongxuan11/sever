import * as controllers from "../controllers";
import express from "express";
const router = express.Router();

router.get("/all", controllers.getAcreages);

export default router;
