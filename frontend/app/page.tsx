"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../features/habitSlice";

export default function Home() {
  const dispatch = useDispatch();
  const habits = useSelector((state: any) => state.habits.habits);

  useEffect(() => {
    dispatch(fetchHabits() as any);
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Lista de hábitos</h1>

        <div className="space-y-4">
          {habits && habits.length > 0 ? (
            habits.map((habit: any) => (
              <div
                key={habit._id}
                className="rounded-lg bg-white p-4 shadow"
              >
                <h2 className="text-xl font-semibold">{habit.name}</h2>
                <p className="mt-1 text-gray-600">{habit.description}</p>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Progreso</p>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-300">
                    <div className="h-full w-1/3 bg-blue-600"></div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Done
                </button>
              </div>
            ))
          ) : (
            <p>No hay hábitos disponibles.</p>
          )}
        </div>
      </div>
    </main>
  );
}