"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HabitList from "./HabitList";
import { fetchHabits } from "../features/habitSlice";

export default function Home() {
  const dispatch = useDispatch();
  const habits = useSelector((state: any) => state.habits?.habits || []);

  useEffect(() => {
    dispatch(fetchHabits() as any);
  }, [dispatch]);

  return (
    <main>
      <h1>Lista de hábitos</h1>
      <HabitList habits={habits} />
    </main>
  );
}