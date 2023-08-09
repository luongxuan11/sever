import * as controllers from "../controllers";
import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
const userRouter = express.Router();

userRouter.use(verifyToken);
userRouter.get("/get-current", controllers.getCurrent);

export default userRouter;
