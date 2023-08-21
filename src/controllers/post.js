import * as service from "../services";
import { internalError, badRequest } from "../middlewares/handleError";
import createError from "http-errors";
const cloudinary = require("cloudinary").v2;

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
    const fileData = req.files;
    const { categoryCode, title, priceNumber, acreageNumber, labelCode} = req.body;
    const { id } = req.user;
    if (!categoryCode || !title || !priceNumber || !acreageNumber || !labelCode || !id) {
      if (fileData && fileData.length > 0) {
        if (fileData.length === 1) {
          // Nếu chỉ có một tệp, xóa bằng phương thức destroy
          await cloudinary.uploader.destroy(fileData[0].filename);
        } else {
          // Nếu có nhiều tệp, lấy danh sách các public IDs và xóa bằng phương thức delete_resources
          const publicIds = fileData.map(file => file.filename);
          await cloudinary.api.delete_resources(publicIds, function(error, result) {
            // console.log(result);  Kết quả từ việc xóa tệp
          });
        }
      }
      return res.status(400).json({
        err: 1,
        mess: "Thiếu thông tin bắt buộc",
      });
    }


    const response = await service.createNewPost(req.body,fileData, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log("here", error);
    internalError(res, error.message);
  }
};

export const getPostLimitAdmin = async (req, res) => {
  const { page, ...query } = req.query;
  const { id } = req.user;
  try {
    if (!id)
      return res.status(400).json({
        err: 1,
        mess: "login please!",
      });
    const response = await service.getPostsLimitAdmin(page, id, query);
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};

export const updatePost = async (req, res) => {
  const { postId, overviewId, imageId, attributeId, imageLink, fileName} = req.body;
  const { id } = req.user;
  const fileData = req.files
  // data new
  let fileDataArr = []
  let fileNameArr = []
  fileData.map((item) =>{
    fileDataArr.push(item.path)
    fileNameArr.push(item.filename)
  })
  // data old
  let dataLinkOld = imageLink.split(",")
  let dataNameOld = JSON.parse(fileName)
  // combine arr
  let combineArrLink = fileDataArr.concat(dataLinkOld)
  let combineArrName = fileNameArr.concat(dataNameOld)
  try {
    if (!postId || !id || !overviewId || !imageId || !attributeId){
      if (fileData && fileData.length > 0) {
        if (fileData.length === 1) {
          // Nếu chỉ có một tệp, xóa bằng phương thức destroy
          await cloudinary.uploader.destroy(fileData[0].filename);
        } else {
          // Nếu có nhiều tệp, lấy danh sách các public IDs và xóa bằng phương thức delete_resources
          const publicIds = fileData.map(file => file?.filename);
          await cloudinary.api.delete_resources(publicIds, function(error, result) {
            // console.log(result);  Kết quả từ việc xóa tệp
          });
        }
      }
      return res.status(400).json({
        err: 1,
        mess: "missing input",
      });
    }
    
    const response = await service.updatePost(req.body, combineArrLink, combineArrName);
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};

export const deletePost = async (req, res) => {
  const { postId, fileName} = req.query; // gửi lên dạng params nên req.query
  // console.log(fileName)
  // console.log(req.query)
  const { id } = req.user;
  try {
    if (!postId || !id)
      return res.status(400).json({
        err: 1,
        mess: "missing input",
      });
    const response = await service.deletePostsLimitAdmin(postId, fileName);
    return res.status(200).json(response);
  } catch (error) {
    internalError(res, error.message);
  }
};
