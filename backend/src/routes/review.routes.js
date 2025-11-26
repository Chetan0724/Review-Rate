import { Router } from "express";
import {
  createReview,
  getReviewsByCompany,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createReview);

router.route("/company/:companyId").get(getReviewsByCompany);

export default router;
