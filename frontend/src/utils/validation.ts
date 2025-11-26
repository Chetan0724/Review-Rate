export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (!fullName) return "Full name is required";
  if (fullName.length < 2) return "Full name must be at least 2 characters";
  return null;
};

export const validateCompanyName = (companyName: string): string | null => {
  if (!companyName) return "Company name is required";
  if (companyName.length < 2)
    return "Company name must be at least 2 characters";
  return null;
};

export const validateFoundedOn = (foundedOn: string): string | null => {
  if (!foundedOn) return "Founded date is required";
  const date = new Date(foundedOn);
  if (isNaN(date.getTime())) return "Invalid date format";
  if (date > new Date()) return "Founded date cannot be in the future";
  return null;
};

export const validateReviewText = (reviewText: string): string | null => {
  if (!reviewText) return "Review text is required";
  if (reviewText.length < 10) return "Review must be at least 10 characters";
  return null;
};

export const validateRating = (rating: number): string | null => {
  if (!rating) return "Rating is required";
  if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";
  return null;
};
