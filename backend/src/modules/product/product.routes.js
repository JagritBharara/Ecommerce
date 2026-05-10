import express from "express";
import protect from "../../middlewares/authMiddleware.js";

import adminOnly from "../../middlewares/adminMiddleware.js";
import { createProduct,searchProducts,getProducts,getProductById } from "./product.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);
router.get("/search", searchProducts);
router.get("/", getProducts);

router.get("/:id", getProductById);

export default router;