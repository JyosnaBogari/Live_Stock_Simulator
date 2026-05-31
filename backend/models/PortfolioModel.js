// import mongoose model and schema
import mongoose, { Schema } from "mongoose";

// create portfolio schema
const portfolioSchema = new Schema(
  {
    // user id tells which user owns this stock
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

    // company name like Apple, TCS
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // how many shares user owns
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // average price at which user bought stock
    avgBuyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    // automatically adds createdAt and updatedAt
    timestamps: true,

    // removes __v field
    versionKey: false,
  }
);

// create and export portfolio model
export const PortfolioModel =
  mongoose.models.portfolio || mongoose.model("portfolio", portfolioSchema);  