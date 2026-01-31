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
  const hashedPassword = await hashPassword(password);

  // Create the User Instance
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    // save in database
    await user.save();

    // create http-only cookies
    generateAccessToken(res, user._id);
    // generateRefreshToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(400).json({ message: "Please enter valid credentials" });
  }
};

const login = async (req, res) => {
  // extract details
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Error("Please fill all the fields");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateAccessToken(res, user._id);
  // generateRefreshToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });

  return;
};

const logout = async (req, res) => {
  // setting token-name as "" to clear it
  // setting expiry to 1970, which means immediate deletion
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export { register, login, logout, getCurrentUser };
