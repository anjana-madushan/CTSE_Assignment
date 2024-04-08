import {
  createLogisticOrder,
  getAllLogisticOrders,
  getLogisticOrderByID,
  updateLogisticOrder,
  deleteLogisticOrderByID,
} from "../service/logistic-service";
import express from "express";

const logisticRouter = express.Router();

logisticRouter.post("/addorder",createLogisticOrder);
logisticRouter.get("/allorders",getAllLogisticOrders);
logisticRouter.get("/order/:order_id",getLogisticOrderByID);
logisticRouter.patch("/updateorder/:orderid",updateLogisticOrder);
logisticRouter.delete("/deleteorder/:order_id",deleteLogisticOrderByID);

export default logisticRouter;