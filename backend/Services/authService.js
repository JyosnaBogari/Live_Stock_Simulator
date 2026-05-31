// import bcryptjs for password hashing
import bcrypt from "bcryptjs";

// import jsonwebtoken for creating login token
import jwt from "jsonwebtoken";

// import user model from correct file name
import { UserTypeModel } from "../models/UserTypeModel.js";

// register service
export const register = async (userObj) => {
  // create new user document
  const userDoc = new UserTypeModel(userObj);

  // validate user data
  await userDoc.validate();

  // hash plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);

   // create referral code using user name and time
userDoc.referralCode = `${userDoc.firstName}_${Date.now()}`
  .replace(/\s+/g, "")
  .toUpperCase();
  
  // save user in mongodb
  const createdUser = await userDoc.save();

  // convert mongoose document to plain object
  const newUserObj = createdUser.toObject();

  // remove password before sending response
  delete newUserObj.password;

  // return safe user object
  return newUserObj;
};

// login service
export const authenticate = async ({ email, password }) => {
  // find user by email
  const user = await UserTypeModel.findOne({ email });

  // check user exists
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }


  // compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  // check password match
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  // check account active status
  if (user.isActive === false) {
    const err = new Error("Your account is blocked.Contact admin");
    err.status = 403;
    throw err;
  }
 
  // create jwt token
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // convert user document to object
  const userObj = user.toObject();

  // remove password
  delete userObj.password;

  // return token and user
  return { token, user: userObj };
};