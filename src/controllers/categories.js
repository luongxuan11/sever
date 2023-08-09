import * as services from "../services";
import { internalError } from "../middlewares/handleError";

export const getCategories = async (req, res) => {
  try {
    const response = await services.getCategories();
    return res.status(200).json(response);
  } catch (error) {
    return internalError(res);
  }
};
