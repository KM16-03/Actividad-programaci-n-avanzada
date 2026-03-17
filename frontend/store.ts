import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./features/habitSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
  },
});