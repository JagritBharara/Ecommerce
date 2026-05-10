import mongoose from "mongoose";

import Order from "./order.model.js";

import Cart from "../cart/cart.model.js";

import Product from "../product/product.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apiError.js";

import ApiResponse from "../../utils/apiResponse.js";

import redis from "../../config/redis.js";

export const createOrder =
  asyncHandler(async (req, res) => {

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

      const userId =
        req.user._id;

      // ==============================
      // Get User Cart
      // ==============================

      const cart =
        await Cart.findOne({
          user: userId,
        }).populate(
          "items.product"
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {
        throw new ApiError(
          400,
          "Cart is empty"
        );
      }

      // ==============================
      // Validate Stock
      // ==============================

      for (const item of cart.items) {

        const product =
          await Product.findById(
            item.product._id
          ).session(session);

        if (
          product.stock <
          item.quantity
        ) {
          throw new ApiError(
            400,
            `${product.title} is out of stock`
          );
        }
      }

      // ==============================
      // Reduce Inventory
      // ==============================

      for (const item of cart.items) {

        const product =
          await Product.findById(
            item.product._id
          ).session(session);

        product.stock -=
          item.quantity;

        await product.save({
          session,
        });
      }

      // ==============================
      // Create Order
      // ==============================

      const orderItems =
        cart.items.map((item) => ({
          product:
            item.product._id,

          quantity:
            item.quantity,

          price:
            item.product.price,
        }));

      const order =
        await Order.create(
          [
            {
              user: userId,

              items: orderItems,

              totalPrice:
                cart.totalPrice,
            },
          ],
          { session }
        );

      // ==============================
      // Clear Cart
      // ==============================

      cart.items = [];

      cart.totalPrice = 0;

      await cart.save({
        session,
      });

      // ==============================
      // Commit Transaction
      // ==============================

      await session.commitTransaction();

      session.endSession();

      // ==============================
      // Invalidate Redis Cache
      // ==============================

      await redis.del(
        `cart:${userId}`
      );

      await redis.flushall();

      return res.status(201).json(
        new ApiResponse(
          201,
          "Order created successfully",
          order[0]
        )
      );

    } catch (error) {

      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  });


  export const getMyOrders =
  asyncHandler(async (req, res) => {

    const orders =
      await Order.find({
        user: req.user._id,
      })
        .populate("items.product")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Orders fetched successfully",
        orders
      )
    );
  });


  export const getAllOrders =
  asyncHandler(async (req, res) => {

    const orders =
      await Order.find()
        .populate("user")
        .populate("items.product")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(
      new ApiResponse(
        200,
        "All orders fetched",
        orders
      )
    );
  });


  export const updateOrderStatus =
  asyncHandler(async (req, res) => {

    const {
      orderId,
    } = req.params;

    const {
      status,
    } = req.body;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    order.status = status;

    await order.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Order status updated",
        order
      )
    );
  });