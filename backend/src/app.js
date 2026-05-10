import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import protect from "./middlewares/authMiddleware.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});
app.get(
  "/api/v1/protected",
  protect,
  (req, res) => {
    res.json({
      success: true,
      message:
        "Protected route accessed",
      user: req.user,
    });
  }
);
app.use(errorMiddleware);
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/products",
  productRoutes
);
app.use(
  "/api/v1/cart",
  cartRoutes
);
app.use(
  "/api/v1/orders",
  orderRoutes
);
export default app;