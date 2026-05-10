import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../utils/apiError.js";

import ApiResponse from "../../utils/apiResponse.js";
import redis from "../../config/redis.js";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../utils/cookieOptions.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";

export const registerUser = asyncHandler(
  async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new ApiError(
        400,
        "User already exists"
      );
    }
    const createdUser = await User.create({
        name,
        email,
        password,
    });
    const user = await User.findById(
    createdUser._id
    ).select("-password");
    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    return res.status(201).json(
      new ApiResponse(
        201,
        "User registered successfully",
        {
          user,
          accessToken,
          refreshToken,
        }
      )
    );
  }
);


export const loginUser = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(
        401,
        "Invalid credentials"
      );
    }

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(
        401,
        "Invalid credentials"
      );
    }

    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);

    const sanitizedUser =
      await User.findById(user._id).select(
        "-password"
      );

    await redis.set(
        `refresh:${user._id}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
    );

    res.cookie(
        "accessToken",
        accessToken,
        accessCookieOptions
    );

    res.cookie(
        "refreshToken",
        refreshToken,
        refreshCookieOptions
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            {
            user: sanitizedUser,
            }
        )
        );
    }
);

export const refreshAccessToken =
  asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(
        401,
        "Refresh token missing"
      );
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const storedToken = await redis.get(
      `refresh:${decoded.userId}`
    );

    if (storedToken !== refreshToken) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }

    const newAccessToken =
      generateAccessToken(decoded.userId);

    res.cookie(
      "accessToken",
      newAccessToken,
      accessCookieOptions
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Access token refreshed"
      )
    );
  });



  export const logoutUser =
  asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      await redis.del(
        `refresh:${decoded.userId}`
      );
    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json(
      new ApiResponse(
        200,
        "Logged out successfully"
      )
    );
  });


  export const getMe =
  asyncHandler(async (req, res) => {

    return res.status(200).json(

      new ApiResponse(
        200,
        "User fetched successfully",
        req.user
      )
    );
  });