import db from "../models";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
require("dotenv").config;
import choThueMatBang from "../../data/chothuematbang.json";
import choThueCanHo from "../../data/chothuecanho.json";
import nhaChoThue from "../../data/nhachothue.json";
import choThuePhongTro from "../../data/chothuephongtro.json";
import { dataPrice, dataAcreage } from "../helpers/data";
import { getNumberFromString, getNumberFromStringV2 } from "../helpers/common";
import generateCode from "../helpers/generateCode";

const dataBody = [
  {
    body: choThueMatBang.body,
    code: 'CTMB' 
  },
  {
    body: choThueCanHo.body,
    code: 'CTCH' 
  },
  {
    body: choThuePhongTro.body,
    code: 'CTPT' 
  },
  {
    body: nhaChoThue.body,
    code: 'NCT' 
  },
];


const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

export const insertServices = () =>
  new Promise(async (resolve, reject) => {
    try {
      const provinces = [];
      const labels = []
      dataBody.forEach((cate) => {
        cate?.body?.forEach(async (item) => {
          let postId = v4(); // do id bảng post là 1 chuỗi string
          let attributeId = v4();
          let userId = v4();
          let overviewId = v4();
          let imageId = v4();
          let currentAcreage = getNumberFromString(item?.header?.attributes?.acreage);
          let currentPrice = getNumberFromString(item?.header?.attributes?.price);
          

          let labelCode = generateCode(item?.header?.class?.classType).trim();
          labels?.every((item) => item?.code !== labelCode) && labels.push({
            code: labelCode,
            value: item?.header?.class?.classType
          })
          let provincesCode = generateCode(item?.header?.address.split(",").slice(-1)[0]).trim();
          provinces?.every((item) => item?.code !== provincesCode) &&
            provinces.push({
              code: provincesCode,
              value: item?.header?.address?.split(",")?.slice(-1)[0].trim(),
            });

          await db.Post.create({
            // bảng Post =>> cái tên phải trùng với tên bảng bên file models
            id: postId,
            title: item?.header?.title,
            star: item?.header?.star,
            labelCode,
            address: item?.header?.address,
            attributeId,
            categoriesCode: cate.code, // categoryCode tương đương với 4 loại bảng data
            description: JSON.stringify(item?.mainContent?.content), // do đây là mảng nên phải chuyển qua string
            userId,
            overviewId,
            imageId,
            acreagesCode: dataAcreage.find((acreage) => acreage.max > currentAcreage && acreage.min <= currentAcreage)?.code, // tức là thằng current phải nhỏ hơn thằng max và lớn hơn thằng min mới lấy
            pricesCode: dataPrice.find((price) => price.max > currentPrice && price.min <= currentPrice)?.code,
            provincesCode,
            pricesNumber: getNumberFromStringV2(item?.header?.attributes?.price),
            acreagesNumber: getNumberFromStringV2(item?.header?.attributes?.acreage)
          });

          // bảng attribute
          await db.Attribute.create({
            id: attributeId,
            price: item?.header?.attributes?.price,
            acreage: item?.header?.attributes?.acreage,
            published: item?.header?.attributes?.published,
            hashtag: item?.header?.attributes?.hashtag,
          });

          // bảng images
          await db.Image.create({
            id: imageId,
            image: JSON.stringify(item?.images),
          });

          // overview: tong quan
          await db.Overview.create({
            id: overviewId,
            code: item?.overview?.content.find(
              (item) => item.name === "Mã tin:"
            )?.content,
            area: item?.overview?.content.find(
              (item) => item.name === "Khu vực"
            )?.content,
            type: item?.overview?.content.find(
              (item) => item.name === "Loại tin rao:"
            )?.content,
            target: item?.overview?.content.find(
              (item) => item.name === "Đối tượng thuê:"
            )?.content,
            bonus: item?.overview?.content.find(
              (item) => item.name === "Gói tin:"
            )?.content,
            created: item?.overview?.content.find(
              (item) => item.name === "Ngày đăng:"
            )?.content,
            expire: item?.overview?.content.find(
              (item) => item.name === "Ngày hết hạn:"
            )?.content,
          });

          // user
          await db.User.create({
            id: userId,
            userName: item?.contact?.content.find(
              (item) => item.name === "Liên hệ:"
            )?.content,
            password: hashPassword("123456"),
            phone: item?.contact?.content.find(
              (item) => item.name === "Điện thoại:"
            )?.content,
            zalo: item?.contact?.content.find((item) => item.name === "Zalo")
              ?.content,
          });
        });
      });

      // province
      provinces?.forEach(async (item) => {
        await db.Province.create(item);
      });
      // label 
      labels?.forEach(async(item) =>{
        await db.Label.create(item)
      })

      resolve("Done");
    } catch (error) {
      reject(error);
    }
  });

export const createPricesAndAcreage = () =>
  new Promise((resolve, reject) => {
    try {
      // dataPrice.forEach(async (item) => {
      //   await db.Price.create({
      //     code: item.code,
      //     value: item.value,
      //   });
      // }),
        dataAcreage.forEach(async (item) => {
          await db.Acreage.create({
            code: item.code,
            value: item.value,
          });
        });

      resolve("OK");
    } catch (error) {
      reject(error);
    }
  });
