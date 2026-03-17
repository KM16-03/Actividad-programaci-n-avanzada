import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHabits } from "../services/habitService";

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
  return await getHabits();
});

const habitSlice = createSlice({
  name: "habits",
  initialState: {
    habits: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.habits = action.payload || [];
    });
  }
});

export default habitSlice.reducer;