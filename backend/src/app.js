import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middlewares/ratelimit.js";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(globalLimiter);
app.use(helmet());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import reviewRoutes from "./routes/review.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };
