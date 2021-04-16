import { Router } from "express";
import middlewares from "../middlewares/index.js";

const route = Router();

export default (router) => {
  router.use("/temp", route);

  route.get("/sub", middlewares.getTempData, (request, response) => {
    return response.json(request.tempData).status(200);
  });
}