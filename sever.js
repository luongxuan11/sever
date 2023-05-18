import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import '../server/src/config/connectDB'
dotenv.config()

import initRouter from "./src/routes"

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

initRouter(app)

const port = process.env.PORT || 3001;

const listener = app.listen(port, () => {
    console.log(`sever's running on the port ${listener.address().port}`)
  });