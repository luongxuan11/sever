import db from "../models";
import { Op } from "sequelize";
import dotenv from "dotenv";
import moment from "moment";
const cloudinary = require('cloudinary').v2
dotenv.config();
import { v4 as generateId } from "uuid";
import generateCode from "../helpers/generateCode";
import generateDate from "../helpers/generateDate";

export const getAllPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await db.Post.findAll({
        raw: true,
        nest: true, // thay vì image."" thì sẽ gộp thành obj
        include: [
          // db image
          { model: db.Image, as: "images", attributes: ["image"] },

          // db attr
          {
            model: db.Attribute,
            as: "attribute",
            attributes: ["price", "acreage", "published", "hashtag"],
          },

          //db user
          {
            model: db.User,
            as: "user",
            attributes: ["userName", "zalo", "phone"],
          },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: res ? 0 : 1,
        mess: res ? "OK" : "got posts fail...",
        res: res,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimit = (page, query, { pricesNumber, acreagesNumber }) =>
  new Promise(async (resolve, reject) => {
    try {
      // let offset = !page || +page <= 1 ? 0 : +page
      const queries = { ...query };
      if (pricesNumber) queries.pricesNumber = { [Op.between]: pricesNumber };
      
      if (acreagesNumber) queries.acreagesNumber = { [Op.between]: acreagesNumber };
      const res = await db.Post.findAndCountAll({
        where: queries,
        raw: true,
        nest: true,
        offset: page * +process.env.LIMIT || 0,
        limit: +process.env.LIMIT,
        order: [["createdAt", "DESC"]],
        include: [
          // db image
          { model: db.Image, as: "images", attributes: ["image"] },

          // db attr
          {
            model: db.Attribute,
            as: "attribute",
            attributes: ["price", "acreage", "published", "hashtag"],
          },

          //db user
          {
            model: db.User,
            as: "user",
            attributes: ["userName", "zalo", "phone", "avatar"],
          },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: res ? 0 : 1,
        mess: res ? "OK" : "got posts fail...",
        res: res,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getNewPost = () =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await db.Post.findAll({
        raw: true,
        nest: true,
        offset: 0,
        order: [["createdAt", "DESC"]], // lọc trực tiếp trong db lọc theo cột createdAt và DESC là giảm dần từ z-a
        limit: +process.env.LIMIT,
        include: [
          // db image
          { model: db.Image, as: "images", attributes: ["image"] },

          // db attr
          {
            model: db.Attribute,
            as: "attribute",
            attributes: ["price", "acreage", "published", "hashtag"],
          },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({
        err: res ? 0 : 1,
        mess: res ? "OK" : "got posts fail...",
        res: res,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewPost = (body,fileData ,userId) => // receive from controller

  new Promise(async (resolve, reject) => {
    try {
      const attributeId = generateId();
      const imageId = generateId();
      const overviewId = generateId();
      const labelCode = body?.labelCode.replace(/,/g, "").trim();
      const provincesCode = body?.province.includes("Thành phố")
        ? generateCode(body?.province?.replace("Thành phố", ""))
        : generateCode(body?.province?.replace("Tỉnh", ""));
      const hashtag = Math.floor(Math.random() * Math.pow(10, 6));
      const currentDate = generateDate();
      const paths = fileData.map(item => item.path)
      const fileName = fileData.map(item => item.filename) 
      console.log(fileName)
      console.log(paths)
      // create post
      await db.Post.create({
        id: generateId(),
        title: body.title,
        labelCode: generateCode(labelCode),
        address: body.address || null,
        attributeId,
        categoriesCode: body.categoryCode,
        description: JSON.stringify(body.description) || null,
        userId,
        overviewId,
        imageId,
        acreagesCode: body.acreageCode || null,
        pricesCode: body.priceCode || null,
        provincesCode,
        pricesNumber: body.priceNumber,
        acreagesNumber: body.acreageNumber,
      });

      // create attribute
      await db.Attribute.create({
        id: attributeId,
        price:
          +body.priceNumber < 1
            ? `${+body.priceNumber * 1000000} đồng/tháng`
            : `${+body.priceNumber} triệu/tháng`,
        acreage: `${body.acreageNumber}m2`,
        published: moment(new Date()).format("DD/MM/YYYY"),
        hashtag: `#${hashtag}`,
      });

      //create image
      await db.Image.create({
        id: imageId,
        image: JSON.stringify(paths),
        fileName: JSON.stringify(fileName)
      });

      // create overview
      await db.Overview.create({
        id: overviewId,
        code: `#${hashtag}`,
        area: body.province || null,
        type: body.category,
        target: body.target,
        bonus: "Tin thường",
        created: currentDate.today,
        expire: currentDate.expireDay,
      });

      // province
      await db.Province.findOrCreate({
        where: {
          [Op.or]: [
            { value: body?.province?.replace("Thành phố", "") },
            { value: body?.province?.replace("Tỉnh", "") },
          ],
        },
        defaults: {
          code: body?.province?.includes("Thành phố")
            ? generateCode(body?.province?.replace("Thành phố", ""))
            : generateCode(body?.province?.replace("Tỉnh", "")),
          value: body?.province?.includes("Thành phố")
            ? body?.province?.replace("Thành phố", "")
            : body?.province?.replace("Tỉnh", ""),
        },
      });

      // label
      await db.Label.findOrCreate({
        where: {
          code: generateCode(labelCode),
        },
        defaults: {
          code: generateCode(labelCode),
          value: body?.labelCode,
        },
      });
      resolve({
        err: 0,
        mess: "OK",
      });
    } catch (error) {
      reject(error);
      if (fileData && fileData.length > 0) {
        if (fileData.length === 1) {
          // Nếu chỉ có một tệp, xóa bằng phương thức destroy
          await cloudinary.uploader.destroy(fileData[0].filename);
        } else {
          // Nếu có nhiều tệp, lấy danh sách các public IDs và xóa bằng phương thức delete_resources
          const publicIds = fileData.map(file => file.filename);
          await cloudinary.api.delete_resources(publicIds, function(error, result) {
            console.log(result); // Kết quả từ việc xóa tệp
          });
        }
      }
    }
  });


  export const getPostsLimitAdmin = (page, id, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { ...query, userId: id};
      const res = await db.Post.findAndCountAll({
        where: queries,
        raw: true,
        nest: true,
        offset: page * +process.env.LIMIT || 0,
        limit: +process.env.LIMIT,
        order: [["createdAt", "DESC"]],
        include: [
          // db image
          { model: db.Image, as: "images", attributes: ["image", "fileName"] },

          // db attr
          {
            model: db.Attribute,
            as: "attribute",
            attributes: ["price", "acreage", "published", "hashtag"],
          },

          // db overview
          {
            model: db.Overview,
            as: "overviews",
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },

          //db user
          // {
          //   model: db.User,
          //   as: "user",
          //   attributes: ["userName", "zalo", "phone"],
          // },
        ],
      });
      resolve({
        err: res ? 0 : 1,
        mess: res ? "OK" : "got posts fail...",
        res: res,
      });
    } catch (error) {
      reject(error);
    }
  });


  // update
  export const updatePost = ({ postId,overviewId,imageId,attributeId, ...body}, combineArrLink, combineArrName) =>
  new Promise(async (resolve, reject) => {
    try {
      const labelCode = body?.labelCode.replace(/,/g, "").trim();
      const provincesCode = body?.province.includes("Thành phố")
        ? generateCode(body?.province?.replace("Thành phố", ""))
        : generateCode(body?.province?.replace("Tỉnh", ""));

        // update
      await db.Post.update({
        title: body.title,
        labelCode: generateCode(labelCode),
        address: body.address || null,
        categoriesCode: body.categoryCode,
        description: JSON.stringify(body.description) || null,
        acreagesCode: body.acreageCode || null,
        pricesCode: body.priceCode || null,
        provincesCode,
        pricesNumber: body.priceNumber,
        acreagesNumber: body.acreageNumber,
      }, {
        where: {id: postId}
      });

      // update attribute
      await db.Attribute.update({
        price:
          +body.priceNumber < 1
            ? `${+body.priceNumber * 1000000} đồng/tháng`
            : `${+body.priceNumber} triệu/tháng`,
        acreage: `${body.acreageNumber}m2`,
      }, {
        where: {id: attributeId}
      });

      //create image
      await db.Image.update({
        image: JSON.stringify(combineArrLink),
        fileName: JSON.stringify(combineArrName)
      }, {
        where: {id: imageId},
      });

      // create overview
      await db.Overview.update({
        area: body.province || null,
        type: body.category,
        target: body.target,
      },{
        where: {id: overviewId}
      });

      // province
      await db.Province.findOrCreate({
        where: {
          [Op.or]: [
            { value: body?.province?.replace("Thành phố", "") },
            { value: body?.province?.replace("Tỉnh", "") },
          ],
        },
        defaults: {
          code: body?.province?.includes("Thành phố")
            ? generateCode(body?.province?.replace("Thành phố", ""))
            : generateCode(body?.province?.replace("Tỉnh", "")),
          value: body?.province?.includes("Thành phố")
            ? body?.province?.replace("Thành phố", "")
            : body?.province?.replace("Tỉnh", ""),
        },
      });

      // label
      await db.Label.findOrCreate({
        where: {
          code: generateCode(labelCode),
        },
        defaults: {
          code: generateCode(labelCode),
          value: body?.labelCode,
        },
      });
      // console.log(res)
      resolve({
        err: 0,
        mess:  "update" ,
      });
    } catch (error) {
      reject(error);
      if (fileData && fileData.length > 0) {
        if (fileData.length === 1) {
          await cloudinary.uploader.destroy(fileData[0].filename);
        } else {
          const publicIds = fileData.map(file => file.filename);
          await cloudinary.api.delete_resources(publicIds, function(error, result) {
            console.log(result);
          });
        }
      }
    }
  });


  // delete
  export const deletePostsLimitAdmin = (postId, fileName) =>
  new Promise(async (resolve, reject) => {
    try {
      const fileNameResult = JSON.parse(fileName)
      console.log("============",fileNameResult)
      const res = await db.Post.destroy({
        where: {id: postId},
        
      });
      console.log(res)
      resolve({
        err: res ? 0 : 1,
        mess: res ? "Delete OK" : "No post delete...",
        res: res,
      });
      if (fileNameResult && fileNameResult.length > 0) {
        if (fileNameResult.length === 1) {
          await cloudinary.uploader.destroy(fileNameResult);
        } else {
          for (const fileName of fileNameResult) {
            await cloudinary.uploader.destroy(fileName, function(error, result) {
              console.log(result);
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });