import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
require("dotenv").config();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

export const register = ({ phone, password, userName }) =>
  new Promise(async (resolve, reject) => {
    try {
      // find and create
      const res = await db.User.findOrCreate({
        where: { phone },
        defaults: {
          userName,
          phone,
          password: hashPassword(password),
          id: v4(),
        },
      });

      // create json token after having..
      const token = res[1]
        ? jwt.sign(
            {
              id: res[0].id,
              phone: res[0].phone,
            },
            process.env.JWT_SECRET,
            { expiresIn: "60s" }
          )
        : null;

      resolve({
        err: res[1] ? 0 : 1,
        mess: res[1] ? "register is successfully" : "phone is used",
        access_token: token ? `Bearer ${token}` : token,
      });
    } catch (error) {
      reject(error);
    }
  });

// login

export const login = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await db.User.findOne({
        where: { phone },
        raw: true,
      });

      // check password
      const isChecked = res && bcrypt.compareSync(password, res.password);

      const token = isChecked
        ? jwt.sign(
            {
              id: res.id,
              phone: res.phone,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
          )
        : null;

        resolve({
          err: token ? 0 : 1,
          mess: token ? "login is successfully" : res ? "password is wrong" : "phone is not register",
          "access_token": token ? `Bearer ${token}` : token
        })
    } catch (error) {
      reject(error);
    }
  });
