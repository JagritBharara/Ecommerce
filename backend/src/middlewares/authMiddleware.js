import jwt from "jsonwebtoken";

import User from "../modules/user/user.model.js";

import ApiError from "../utils/apiError.js";

const protect = async (
  req,
  res,
  next
) => {
  try {
    // Get token from cookie OR bearer header
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.split(
        " "
      )[1];

    // No token
    if (!token) {
      throw new ApiError(
        401,
        "Unauthorized"
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Find user
    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;