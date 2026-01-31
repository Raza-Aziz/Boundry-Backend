import bcrypt from "bcryptjs";

// ! Remember : bcrypt methods are async, so use async-await with them

export const hashPassword = async (plainPassword, rounds = 10) => {
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainPassword, salt);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
