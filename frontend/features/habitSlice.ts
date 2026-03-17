import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHabits, markHabitDone } from "../services/habitService";

export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async () => {
    const response = await getHabits();
    return response;
  }
);

export const markDone = createAsyncThunk(
  "habits/markDone",
  async (habitId: string, thunkAPI) => {
    try {
      const response = await markHabitDone(habitId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Falló al marcarlo como hecho");
    }
  }
);

interface Habit {
  _id: string;
  title: string;
  description: string;
  days: number;
  startDate: string;
  lastDone: string;
  lastUpdate: string;
}

interface HabitState {
  habits: Habit[];
  status: "loading" | "success" | "failed";
  error: string;
}

const initialState: HabitState = {
  habits: [],
  status: "loading",
  error: "",
};

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "success";
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state) => {
        state.status = "failed";
        state.error = "Error al obtener hábitos";
      })
      .addCase(markDone.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(markDone.fulfilled, (state, action) => {
        state.status = "success";

        const updatedHabit = action.payload.habit;
        const habitIndex = state.habits.findIndex(
          (habit) => habit._id === updatedHabit._id
        );

        if (habitIndex !== -1) {
          state.habits[habitIndex] = updatedHabit;
        }

        state.error = action.payload.message;
      })
      .addCase(markDone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default habitSlice.reducer;