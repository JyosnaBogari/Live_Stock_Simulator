import mongoose, { Schema } from "mongoose";

// create transaction schema
const transactionSchema = new Schema(
  {
    // user id tells who made this transaction
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // stock symbol
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // company name
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // transaction type buy or sell
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    // number of shares bought or sold
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // price per share during transaction
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // total amount quantity multiplied by price
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    // adds createdAt and updatedAt
    timestamps: true,

    // removes __v
    versionKey: false,
  }
);

// create and export transaction model
export const TransactionModel =
  mongoose.models.transaction || mongoose.model("transaction", transactionSchema);