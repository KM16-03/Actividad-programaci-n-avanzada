"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, markDone } from "../features/habitSlice";

export default function Page() {
  const dispatch = useDispatch();
  const habits = useSelector((state: any) => state.habits.habits);
  const status = useSelector((state: any) => state.habits.status);
  const error = useSelector((state: any) => state.habits.error);

  useEffect(() => {
    dispatch(fetchHabits() as any);
  }, [dispatch]);

  const handleDone = (id: string) => {
    dispatch(markDone(id) as any);
  };

  const getProgress = (days: number) => {
    return (days / 66) * 100;
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-5xl font-bold text-black">Habits</h1>

        {status === "loading" && (
          <p className="mb-4 text-sm text-black">Loading...</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-black">{error}</p>
        )}

        <div className="space-y-4">
          {habits.map((habit: any) => (
            <div key={habit._id} className="flex items-center gap-4">
              <div className="w-32 text-base text-black">
                {habit.title} {habit.days}
              </div>

              <div className="h-4 flex-1 rounded bg-gray-400">
                <div
                  className="h-4 rounded bg-green-500"
                  style={{ width: `${getProgress(habit.days)}%` }}
                ></div>
              </div>

              <button
                onClick={() => handleDone(habit._id)}
                className="rounded bg-black px-6 py-3 text-white"
              >
                Hecho
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}