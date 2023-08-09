import db from "../models"; // tự động lấy file index trong file

export const getOne = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await db.User.findOne({ // lấy thông tin 1 thằng theo id
        where: { id: userId },
        attributes: { // k lấy trong key này
          exclude: ['password', 'createdAt', 'updatedAt']
        },
        // include: [ // liên kết giữa các bảng
        //   {
        //     model: db.Role, as: 'roleData',
        //     attributes: [ // chỉ lấy dòng này
        //       'id', 'code', 'value'
        //     ]
        //   }
        // ]
      });
      
      resolve({
        err: res ? 0 : 1,
        mes: res ? "got" : "user not found",
        userData: res
      });
    } catch (error) {
      reject(error);
    }
  });