import * as services from '../services'
import { internalError } from '../middlewares/handleError';

export const getPrices = async (req, res) => {
    try {
      const response = await services.getPrices();
      return res.status(200).json(response);
    } catch (error) {
      return internalError(res);
    }
  };
  
  export const getAcreages = async (req, res) => {
    try {
      const response = await services.getAcreage();
      return res.status(200).json(response);
    } catch (error) {
      return internalError(res);
    }
  };