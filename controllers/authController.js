import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { authenticateToken } from "../middleware/auth.js";
import { authorizeAdmin } from "../middleware/auth.js";
import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const register = async (req, res) => {
  // extract the details
  const { username, email, password } = req.body;

  // if anything not present
  if (!username || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  // check for existing user by email
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // hash the password
  const hashedPassword = hashPassword(password);

  // Create the User Instance
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    // create http-only cookies
    generateAccessToken(res, user._id);
    generateRefreshToken(res, user._id);

    // save in database
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(400).json({ message: "Please enter valid credentials" });
  }
};

export { register };
