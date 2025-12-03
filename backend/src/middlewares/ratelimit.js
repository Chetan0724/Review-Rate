import { rateLimit } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many signup attempts. Try again after an hour.",
  },
});

export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Review limit reached. Try again after an hour.",
  },
});

export const companyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many company creation requests.",
  },
});
