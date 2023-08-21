import joi from "joi"

export const password = joi.string().min(6).max(20).required()
export const userName = joi.string().min(1).required()
export const phone = joi.string().pattern(/^[0-9]{10}$/).required();

export const image = joi.string().required()