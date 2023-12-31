import * as controllers from "../controllers";
import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/verifyToken";
import uploadCloud from "../middlewares/uploader";

router.get("/all", controllers.getPost);
router.get("/limit", controllers.getPostLimit);
router.get("/new-post", controllers.getNewPost);

router.use(verifyToken);
router.post("/create-new",uploadCloud.array("images", 6),controllers.createNewPost);
router.get("/limit-admin", controllers.getPostLimitAdmin);
router.put("/update", uploadCloud.array("imageFile", 6),controllers.updatePost);
router.delete("/delete", controllers.deletePost);

export default router;
