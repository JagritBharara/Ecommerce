import express from "express";

import { createProduct,searchProducts,getProducts,getProductById } from "./product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/search", searchProducts);
router.get("/", getProducts);

router.get("/:id", getProductById);

export default router;