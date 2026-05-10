import express from "express";

import protect from "../../middlewares/authMiddleware.js";

import {
  addToCart,
  getCart,
} from "./cart.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  addToCart
);

router.get(
  "/",
  protect,
  getCart
);

export default router;