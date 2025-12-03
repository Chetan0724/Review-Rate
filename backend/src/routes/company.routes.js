import { Router } from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
} from "../controllers/company.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { companyLimiter } from "../middlewares/ratelimit.js";

const router = Router();

router.route("/").get(getAllCompanies);

router.route("/create").post(
  companyLimiter,
  verifyJWT,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  createCompany
);

router.route("/:companyId").get(getCompanyById);

export default router;
