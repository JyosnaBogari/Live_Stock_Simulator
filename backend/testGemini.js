// import dotenv
import dotenv from "dotenv";

// load env variables
dotenv.config();

// import gemini sdk
import { GoogleGenerativeAI } from "@google/generative-ai";

// create gemini instance using api key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// test gemini function
const testGemini = async () => {
  try {
    // select available gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // send test prompt
    const result = await model.generateContent("What is Apple stock?");

    // get response object
    const response = await result.response;

    // print ai response text
    console.log(response.text());
  } catch (err) {
    // print full error
    console.log(err);
  }
};

// call test function
testGemini();