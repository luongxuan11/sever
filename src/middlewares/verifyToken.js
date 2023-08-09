import jwt from "jsonwebtoken"
import { notAuth } from "./handleError"

export const verifyToken = (req, res, next) =>{
    const token = req.headers.authorization 
    if(!token)  return notAuth('Require authorization...', res) 
    const accessToken = token.split(' ')[1]
    // console.log(accessToken)
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decode) =>{ 
        if(err) return notAuth(err, res)

       req.user = decode
       next() 
    })
}