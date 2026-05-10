import express from "express";

import protect from "../../middlewares/authMiddleware.js";
import adminOnly from "../../middlewares/adminMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "./order.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

router.patch(
  "/admin/:orderId",
  protect,
  adminOnly,
  updateOrderStatus
);
export default router;