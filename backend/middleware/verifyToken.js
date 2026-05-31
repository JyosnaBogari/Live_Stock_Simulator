// import jsonwebtoken to verify token
import jwt from "jsonwebtoken";

// import user model to find user from database
import { UserTypeModel } from "../models/UserTypeModel.js";

// middleware to verify logged in user
export const verifyToken = async (req, res, next) => {
  try {
    // get token from cookie
    const token = req.cookies.token;

    // if token not found
    if (!token) {
      return res.status(401).json({
        message: "error occurred",
        error: "Please login first",
      });
    }

    // verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user from token id and remove password
    const user = await UserTypeModel.findById(decoded._id).select("-password");

    // if user not found
    if (!user) {
      return res.status(401).json({
        message: "error occurred",
        error: "User not found",
      });
    }

    // attach user to request
    req.user = user;

    // go to next middleware or api
    next();
  } catch (err) {
    // token invalid or expired
    res.status(401).json({
      message: "error occurred",
      error: "Invalid or expired token",
    });
  }
};