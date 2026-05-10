import ApiError from "../utils/apiError.js";

const adminOnly = (
  req,
  res,
  next
) => {

  if (
    req.user.role !== "admin"
  ) {
    throw new ApiError(
      403,
      "Access denied. Admin only."
    );
  }

  next();
};

export default adminOnly;