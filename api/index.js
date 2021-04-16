import { Router } from "express";
import temp from "./routes/temp.js";

export default () => {
  const router = Router();

  temp(router);

  return router;
}