import { Router } from "express";
import {
  createReview,
  getReviewsByCompany,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reviewLimiter } from "../middlewares/ratelimit.js";

const router = Router();

router.route("/create").post(reviewLimiter, verifyJWT, createReview);

router.route("/company/:companyId").get(getReviewsByCompany);

export default router;
