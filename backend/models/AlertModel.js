// import model and schema from mongoose
import mongoose, { Schema } from "mongoose";

// create alert schema
const alertSchema = new Schema(
  {
    // user id tells which user created this alert
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // stock symbol like AAPL, TCS, INFY
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // company name like Apple or TCS
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // target price selected by user
    targetPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // alert condition above or below
    condition: {
      type: String,
      enum: ["ABOVE", "BELOW"],
      required: true,
    },

    // tells whether alert is active or not
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // adds createdAt and updatedAt
    timestamps: true,

    // removes __v
    versionKey: false,
  }
);

// create and export alert model
export const AlertModel =
  mongoose.models.alert || mongoose.model("alert", alertSchema);