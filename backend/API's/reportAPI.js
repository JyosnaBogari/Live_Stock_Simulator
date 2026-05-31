import exp from "express";
import { ReportModel } from "../models/ReportModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const reportRoute = exp.Router();

reportRoute.post("/create", verifyToken, async (req, res, next) => {
  try {
    const { type, subject, message } = req.body;

    const report = await ReportModel.create({
      userId: req.user._id,
      type,
      subject,
      message,
    });

    res.status(201).json({
      message: "report submitted",
      payload: report,
    });
  } catch (err) {
    next(err);
  }
});

reportRoute.get("/my-reports", verifyToken, async (req, res, next) => {
  try {
    const reports = await ReportModel.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "my reports fetched",
      payload: reports,
    });
  } catch (err) {
    next(err);
  }
});