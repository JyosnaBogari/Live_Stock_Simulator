import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    type: {
      type: String,
      enum: ["BUG", "FEEDBACK", "SUPPORT"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },

    adminReply: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ReportModel =
  mongoose.models.report || mongoose.model("report", reportSchema);