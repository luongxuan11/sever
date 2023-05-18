import auth from './auth'
import userRouter from './user';
import { notfound } from "../middlewares/handleError";

const initRouter = (app) =>{
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/auth', auth)
    app.get('/', (req, res) => {
        res.send('server on...')
    })


    app.use(notfound)
}

export default initRouter