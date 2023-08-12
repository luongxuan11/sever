import * as controllers from "../controllers";
import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/verifyToken";

router.get("/all", controllers.getPost);
router.get("/limit", controllers.getPostLimit);
router.get("/new-post", controllers.getNewPost);

router.use(verifyToken)
router.post('/create-new',  controllers.createNewPost)
router.get("/limit-admin", controllers.getPostLimitAdmin);

export default router;
