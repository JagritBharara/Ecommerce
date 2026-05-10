import Cart from "./cart.model.js";

import Product from "../product/product.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apiError.js";

import ApiResponse from "../../utils/apiResponse.js";

import redis from "../../config/redis.js";

export const addToCart =
  asyncHandler(async (req, res) => {

    const userId =
      req.user._id;

    const {
      productId,
      quantity,
    } = req.body;

    // ==============================
    // Validate Product
    // ==============================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    // ==============================
    // Validate Stock
    // ==============================

    if (
      product.stock < quantity
    ) {
      throw new ApiError(
        400,
        "Insufficient stock"
      );
    }

    // ==============================
    // Find User Cart
    // ==============================

    let cart =
      await Cart.findOne({
        user: userId,
      });

    // ==============================
    // Create Cart If Missing
    // ==============================

    if (!cart) {

      cart =
        await Cart.create({
          user: userId,
          items: [],
        });
    }

    // ==============================
    // Check Existing Item
    // ==============================

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {

      existingItem.quantity +=
        quantity;

    } else {

      cart.items.push({
        product: productId,
        quantity,
      });
    }

    // ==============================
    // Recalculate Total
    // ==============================

    let total = 0;

    for (const item of cart.items) {

      const cartProduct =
        await Product.findById(
          item.product
        );

      total +=
        cartProduct.price *
        item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    // ==============================
    // Populate Product Details
    // ==============================

    await cart.populate(
      "items.product"
    );

    // ==============================
    // Cache Cart In Redis
    // ==============================

    await redis.set(
      `cart:${userId}`,
      JSON.stringify(cart),
      "EX",
      3600
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product added to cart",
        cart
      )
    );
  });


  export const getCart =
  asyncHandler(async (req, res) => {

    const userId =
      req.user._id;

    // ==============================
    // Check Redis Cache
    // ==============================

    const cachedCart =
      await redis.get(
        `cart:${userId}`
      );

    if (cachedCart) {

      return res.status(200).json(
        new ApiResponse(
          200,
          "Cart fetched from cache",
          JSON.parse(cachedCart)
        )
      );
    }

    // ==============================
    // Fetch Cart
    // ==============================

    const cart =
      await Cart.findOne({
        user: userId,
      }).populate(
        "items.product"
      );

    if (!cart) {

      return res.status(200).json(
        new ApiResponse(
          200,
          "Cart is empty",
          {
            items: [],
            totalPrice: 0,
          }
        )
      );
    }

    // ==============================
    // Cache Cart
    // ==============================

    await redis.set(
      `cart:${userId}`,
      JSON.stringify(cart),
      "EX",
      3600
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Cart fetched successfully",
        cart
      )
    );
  });