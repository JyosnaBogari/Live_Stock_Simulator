// import create function from zustand to create global store
import { create } from "zustand";
import BASE_URL from "../config/baseAPI";
// import axios to call backend APIs
import axios from "axios";

// backend base url for user APIs
const API_URL = `${BASE_URL}/user-api`;

// create auth store
export const useAuth = create((set) => ({
  // stores logged in user data
  currentUser: null,

  // tells whether user is logged in or not
  isAuthenticated: false,

  // controls loading state for buttons and page loading
  loading: false,
   
  authChecked:false,
  // stores error message from backend
  error: null,

  // register user function
  registerUser: async (userObj) => {
    try {
      // start loading and clear previous error
      set({ loading: true, error: null });

      // send signup data to backend register API
      const res = await axios.post(`${API_URL}/register`, userObj, {
        // allows browser to send and receive cookies
        withCredentials: true,
      });

      // save user details in frontend store after successful signup
      // after signup user should not be logged in automatically
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      // return success result to SignUp component
      return {
        success: true,
        user: res.data.payload,
      };
    } catch (err) {
      // print full error in browser console
      console.log("FULL REGISTER ERROR:", err);

      // print backend response in browser console
      console.log("BACKEND RESPONSE:", err.response?.data);

      // get proper backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      }

      // save error in store
      set({
        error: msg,
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

      // return failure result to SignUp component
      return {
        success: false,
        message: msg,
      };
    }
  },

  // login user function
  login: async (userCredObj) => {
    try {
      // start loading and clear previous error
      set({ loading: true, error: null });

      // send login data to backend login API
      const res = await axios.post(`${API_URL}/login`, userCredObj, {
        // allows browser to send and receive cookies
        withCredentials: true,
      });

      // save logged in user details
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // return success result to Login component
      return {
        success: true,
        user: res.data.payload,
      };
    } catch (err) {
      // print login error in browser console
      console.log("FULL LOGIN ERROR:", err);

      // print backend response in browser console
      console.log("LOGIN BACKEND RESPONSE:", err.response?.data);

      // get proper backend error message
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed";

      if (err.code === "ERR_NETWORK") {
        msg = "Server is not reachable. Please try again later.";
      }

      // save login error
      set({
        error: msg,
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

      // return failure result to Login component
      return {
        success: false,
        message: msg,
      };
    }
  },

  // check user login status after refresh
  checkAuth: async () => {
    try {
      // start auth checking
      set({ loading: true, error: null });

      // call backend me API to check cookie token
      const res = await axios.get(`${API_URL}/me`, {
        // sends cookie to backend
        withCredentials: true,
      });

      // if token is valid store current user
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
        error: null,
      });
    } catch (err) {
      // make user logged out if token missing or expired
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        authChecked: true,
        error: null,
      });
    }
  },

  // logout user function
  logout: async () => {
    try {
      // start loading
      set({ loading: true, error: null });

      // call backend logout API
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          // sends cookie to backend
          withCredentials: true,
        }
      );

      // clear frontend auth state
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      // return success result to Header component
      return {
        success: true,
      };
    } catch (err) {
      // get backend logout error
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Logout failed";

      // save error and stop loading
      set({
        error: msg,
        loading: false,
      });

      // return failure result
      return {
        success: false,
        message: msg,
      };
    }
  },

  // update profile function
updateProfile: async (profileObj) => {
  try {
    // start loading
    set({ loading: true, error: null });

    // call backend update profile api
    const res = await axios.patch(`${API_URL}/update-profile`, profileObj, {
      // send cookie
      withCredentials: true,
    });

    // update current user
    set({
      currentUser: res.data.payload,
      loading: false,
      error: null,
    });

    // return success
    return {
      success: true,
      user: res.data.payload,
    };
  } catch (err) {
    // get error
    let msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Profile update failed";

    if (err.code === "ERR_NETWORK") {
      msg = "Server is not reachable. Please try again later.";
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      msg = "Session expired. Please login again.";
      set({ currentUser: null, isAuthenticated: false });
      // Use window.location for forced redirect if session dies during update
      sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
    }

    // save error
    set({
      loading: false,
      error: msg,
    });

    // return failure
    return {
      success: false,
      message: msg,
    };
  }
},

// change password function
changePassword: async (passwordObj) => {
  try {
    // start loading
    set({ loading: true, error: null });

    // call backend change password api
    await axios.patch(`${API_URL}/change-password`, passwordObj, {
      // send cookie
      withCredentials: true,
    });

    // stop loading
    set({
      loading: false,
      error: null,
    });

    // return success
    return {
      success: true,
    };
  } catch (err) {
    // get error
    let msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Password change failed";

    if (err.code === "ERR_NETWORK") {
      msg = "Server is not reachable. Please try again later.";
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      msg = "Session expired. Please login again.";
      set({ currentUser: null, isAuthenticated: false });
      sessionStorage.setItem(
  "auth-message",
  "Session expired. Please login again."
);
window.location.href = "/login";
    }

    // save error
    set({
      loading: false,
      error: msg,
    });

    // return failure
    return {
      success: false,
      message: msg,
    };
  }
},
}));