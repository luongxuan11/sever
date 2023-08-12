import * as service from "../services";
import { internalError, badRequest } from "../middlewares/handleError";
import createError from "http-errors";

export const getPost = async (req, res) => {
  try {
    const response = await service.getAllPostsService();
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};

export const getPostLimit = async (req, res) => {
  const { page, pricesNumber, acreagesNumber, ...query } = req.query; // query là các tham số được client gửi về sever
  // console.log(req.query)

  try {
    const response = await service.getPostsLimit(page, query, {
      pricesNumber,
      acreagesNumber,
    });
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};

export const getNewPost = async (req, res) => {
  try {
    const response = await service.getNewPost();
    return res.status(200).json(response);
  } catch (error) {
    console.log("check>>>>>>>>>>>>>>>.", error);
    internalError(res, error.message);
  }
};

export const createNewPost = async (req, res) => {
  try {
    const { categoryCode, title, priceNumber, acreageNumber, labelCode } = req.body;
    const { id } = req.user;

    if (
      !categoryCode &&
      !title &&
      !id &&
      !priceNumber &&
      !acreageNumber &&
      !labelCode
    ) {
      return res.status(400).json({
        err: 1,
        mess: "missing inputs",
      });
    }

    // return res.status(200).json(req.body);
    const response = await service.createNewPost(req.body, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log("here", error);
    internalError(res, error.message);
  }
};

export const getPostLimitAdmin = async (req, res) => {
  const { page, ...query } = req.query;
  const {id} = req.user
  try {
    if(!id) return res.status(400).json({
      err: 1,
      mess: 'login please!'
    })
    const response = await service.getPostsLimitAdmin(page, id ,query);
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};