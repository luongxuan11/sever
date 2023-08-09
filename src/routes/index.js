import auth from "./auth";
import userRouter from "./user";
import insertRouter from "./insert";
import categories from "./categories";
import post from "./post";
import price from "./priceRoute"
import acreage from "./acreageRoute"
import province from "./provinceRoute"
import { notfound } from "../middlewares/handleError";

const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/insert", insertRouter);
  app.use("/api/v1/categories", categories);
  app.use("/api/v1/post", post);
  app.use("/api/v1/price", price);
  app.use("/api/v1/acreage", acreage);
  app.use("/api/v1/province", province);
  app.get("/", (req, res) => {
    res.send("server on...");
  });

  app.use(notfound);
};

export default initRouter;
