import db from "../models";
import { Op } from "sequelize";
import dotenv from "dotenv";
import moment from "moment";
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

export const createNewPost = (body, userId) => // receive from controller

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
        image: JSON.stringify(body.images),
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
          { model: db.Image, as: "images", attributes: ["image"] },

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
  export const updatePost = ({ postId,overviewId,imageId,attributeId, ...body}) =>
  new Promise(async (resolve, reject) => {
    console.log(imageId)
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
        image: JSON.stringify(body.images),
      }, {
        where: {id: imageId}
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
    }
  });