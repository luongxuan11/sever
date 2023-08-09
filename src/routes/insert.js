import * as controllers from "../controllers"
import express from "express"
const router = express.Router()

router.post('/', controllers.insert)

export default router