// import model and schema from mongoose
import mongoose, { Schema } from "mongoose";

// create watchlist schema
const watchlistSchema = new Schema(
  {
    // user id tells which user saved this stock
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // stock symbol like AAPL or TSLA
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // company name like Apple or Tesla
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // latest price when user added to watchlist
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // stock change percentage
    change: {
      type: String,
      default: "0%",
    },
  },
  {
    // add createdAt and updatedAt
    timestamps: true,

    // remove __v field
    versionKey: false,
  }
);

// prevent same user from adding same stock twice
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// create and export watchlist model
export const WatchlistModel =
  mongoose.models.watchlist || mongoose.model("watchlist", watchlistSchema);