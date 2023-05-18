import express from 'express'

const userRouter = express.Router()

userRouter.get('/', (req, res) =>{
    res.send('user on...')
})

export default userRouter