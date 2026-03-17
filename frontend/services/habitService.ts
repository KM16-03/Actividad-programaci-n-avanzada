const API_URL = "http://localhost:3001";

export const getHabits = async () => {
  const response = await fetch(`${API_URL}/habits`);

  if (!response.ok) {
    throw new Error("Failed to fetch habits");
  }

  return response.json();
};

export const markHabitDone = async (id: string) => {
  const response = await fetch(`${API_URL}/habits/${id}/done`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark habit as done");
  }

  return response.json();
};