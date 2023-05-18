import * as services from "../services"
import { internalError, badRequest } from '../middlewares/handleError'
import { phone, password, userName } from "../helpers/joi_schema"
import joi from "joi"

export const register = async (req, res) =>{
    try {
        const { error } = joi.object({phone, password, userName}).validate(req.body)

        if(error) return badRequest(error.message, res)
        const response = await services.register(req.body)
        return res.status(200).json(response)
        
    } catch (error) {
        internalError(res)
    }
}


export const login = async (req, res) =>{
    try {
        const { error } = joi.object({phone, password}).validate(req.body)

        if(error) return badRequest(error.details[0]?.message, res)
        const response = await services.login(req.body)
        return res.status(200).json(response)
        
    } catch (error) {
        internalError(res)
    }
}