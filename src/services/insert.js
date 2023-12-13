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
    code: "CTMB",
  },
  {
    body: choThueCanHo.body,
    code: "CTCH",
  },
  {
    body: choThuePhongTro.body,
    code: "CTPT",
  },
  {
    body: nhaChoThue.body,
    code: "NCT",
  },
];

const categories = [
  {
    code: "CTCH",
    value: "Cho thuê căn hộ",
    header: "Cho Thuê Căn Hộ Chung Cư, Giá Rẻ, Mới Nhất 2022",
    subheader:
      "Cho thuê căn hộ - Kênh đăng tin cho thuê căn hộ số 1: giá rẻ, chính chủ, đầy đủ tiện nghi. Cho thuê chung cư với nhiều mức giá, diện tích cho thuê khác nhau.",
  },
  {
    code: "CTMB",
    value: "Cho thuê mặt bằng",
    header:
      "Cho Thuê Mặt Bằng, Cho Thuê Văn Phòng, Cửa Hàng, Kiot, Mới Nhất 2022",
    subheader:
      "Cho thuê mặt bằng - Kênh đăng tin cho thuê mặt bằng, cho thuê cửa hàng, cho thuê kiot số 1: giá rẻ, mặt tiền, khu đông dân cư, phù hợp kinh doanh.",
  },
  {
    code: "CTPT",
    value: "Cho thuê phòng trọ",
    header: "Cho Thuê Phòng Trọ, Giá Rẻ, Tiện Nghi, Mới Nhất 2022",
    subheader:
      "Cho thuê phòng trọ - Kênh thông tin số 1 về phòng trọ giá rẻ, phòng trọ sinh viên, phòng trọ cao cấp mới nhất năm 2022. Tất cả nhà trọ cho thuê giá tốt nhất tại Việt Nam.",
  },
  {
    code: "NCT",
    value: "Nhà cho thuê",
    header: "Cho Thuê Nhà Nguyên Căn, Giá Rẻ, Chính Chủ, Mới Nhất 2022",
    subheader:
      "Cho thuê nhà nguyên căn - Kênh đăng tin cho thuê nhà số 1: giá rẻ, chính chủ, miễn trung gian, đầy đủ tiện nghi, mức giá, diện tích cho thuê khác nhau.",
  },
];

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

export const insertServices = () =>
  new Promise(async (resolve, reject) => {
    try {
      const provinces = [];
      const labels = [];

      await db.Category.bulkCreate(categories);

      dataBody.forEach((cate) => {
        cate?.body?.forEach(async (item) => {
          let postId = v4();
          let attributeId = v4();
          let userId = v4();
          let overviewId = v4();
          let imageId = v4();
          let currentAcreage = getNumberFromString(
            item?.header?.attributes?.acreage
          );
          let currentPrice = getNumberFromString(
            item?.header?.attributes?.price
          );

          let labelCode = generateCode(item?.header?.class?.classType).trim();
          labels?.every((item) => item?.code !== labelCode) &&
            labels.push({
              code: labelCode,
              value: item?.header?.class?.classType,
            });
          let provincesCode = generateCode(
            item?.header?.address.split(",").slice(-1)[0]
          ).trim();
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
            acreagesCode: dataAcreage.find(
              (acreage) =>
                acreage.max > currentAcreage && acreage.min <= currentAcreage
            )?.code, // tức là thằng current phải nhỏ hơn thằng max và lớn hơn thằng min mới lấy
            pricesCode: dataPrice.find(
              (price) => price.max > currentPrice && price.min <= currentPrice
            )?.code,
            provincesCode,
            pricesNumber: getNumberFromStringV2(
              item?.header?.attributes?.price
            ),
            acreagesNumber: getNumberFromStringV2(
              item?.header?.attributes?.acreage
            ),
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
      labels?.forEach(async (item) => {
        await db.Label.create(item);
      });

      resolve("Done");
    } catch (error) {
      reject(error);
    }
  });

export const createPricesAndAcreage = () =>
  new Promise((resolve, reject) => {
    try {
      // dataPrice.map(async (item) => {
      //   await db.Price.create({
      //     code: item.code,
      //     value: item.value,
      //   });
      // }),
        dataAcreage.map(async (item) => {
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
