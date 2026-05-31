// import express
import exp from "express";

// import auth service functions
import { register, authenticate } from "../Services/authService.js";

// import verify token middleware
import { verifyToken } from "../middleware/verifyToken.js";

// import bcrypt for password checking and hashing
import bcrypt from "bcryptjs";

// import user model
import { UserTypeModel } from "../models/UserTypeModel.js";

// create user router
export const userRoute = exp.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 1000,
};

// register api
userRoute.post("/register", async (req, res, next) => {
  try {
    // get user data from frontend
    const userObj = req.body;

    // create user
    const newUser = await register(userObj);

    // send success response
    res.status(201).json({
      message: "user registered successfully",
      payload: newUser,
    });
  } catch (err) {
    // pass error to global error handler
    next(err);
  }
});

// login api
userRoute.post("/login", async (req, res, next) => {
  try {
    // authenticate user
    const { token, user } = await authenticate(req.body);

    // store token in cookie
    res.cookie("token", token, cookieOptions);

    // send success response
    res.status(200).json({
      message: "login successful",
      payload: user,
    });
  } catch (err) {
    // pass error
    next(err);
  }
});

// check current user api
userRoute.get("/me", verifyToken, async (req, res) => {
  // send logged in user
  res.status(200).json({
    message: "current user fetched",
    payload: req.user,
  });
});

// logout api
userRoute.post("/logout", async (req, res) => {
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    message: "logout successful",
  });
});

// update profile api
userRoute.patch("/update-profile", verifyToken, async (req, res, next) => {
  try {
    // get user id from token
    const userId = req.user._id;

    // get editable data from frontend
    const { firstName, lastName, theme, language } = req.body;

    // update user
    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        theme,
        language,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // send response
    res.status(200).json({
      message: "profile updated successfully",
      payload: updatedUser,
    });
  } catch (err) {
    // send error to middleware
    next(err);
  }
});

// change password api
userRoute.patch("/change-password", verifyToken, async (req, res, next) => {
  try {
    // get user id
    const userId = req.user._id;

    // get passwords from frontend
    const { oldPassword, newPassword } = req.body;

    // validate fields
    if (!oldPassword || !newPassword) {
      const err = new Error("Old password and new password are required");
      err.status = 400;
      throw err;
    }

    // validate new password length
    if (newPassword.length < 8) {
      const err = new Error("New password must be at least 8 characters");
      err.status = 400;
      throw err;
    }

    // find user with password
    const user = await UserTypeModel.findById(userId);

    // compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // if old password wrong
    if (!isMatch) {
      const err = new Error("Old password is incorrect");
      err.status = 401;
      throw err;
    }

    // hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    // save user
    await user.save();

    // send response
    res.status(200).json({
      message: "password changed successfully",
    });
  } catch (err) {
    // send error
    next(err);
  }
});