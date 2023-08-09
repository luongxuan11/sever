import * as services from '../services'
import { internalError } from '../middlewares/handleError';

export const getProvince = async (req, res) => {
    try {
      const response = await services.getProvince();
      return res.status(200).json(response);
    } catch (error) {
      return internalError(res, error.message);
    }
  };