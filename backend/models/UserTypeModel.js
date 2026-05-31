import mongoose, { Schema } from "mongoose";

const emailRegex =
  /^(?![0-9]+@)(?!.*\.\.)[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|anurag\.edu\.in)$/;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailRegex, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },

    walletBalance: {
      type: Number,
      default: 100000,
    },

    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },

    language: {
      type: String,
      enum: ["english", "telugu", "hindi"],
      default: "english",
    },

    referralCode: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserTypeModel =
  mongoose.models.user || mongoose.model("user", userSchema);