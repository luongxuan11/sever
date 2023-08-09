import * as services from "../services";
import { internalError, badRequest } from "../middlewares/handleError";

export const getCurrent = async (req, res) => {
  try {
    const { id } = req.user; // do ở bên verify lưu giá trị decode vào user nên ở đây ta lấy được
    const response = await services.getOne(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalError(res);
  }
};
