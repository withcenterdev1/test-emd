import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import blogReducer from "../redux/blogSlice";

export const store = configureStore({
  reducer: { auth: authReducer, blogs: blogReducer },
});
