const API_URL = "http://localhost:3001";

export const getHabits = async () => {
  const response = await fetch(`${API_URL}/habits`);

  if (!response.ok) {
    throw new Error("Error al obtener hábitos");
  }

  return response.json();
};

export const markHabitDone = async (id: string) => {
  const response = await fetch(`${API_URL}/habits/${id}/done`, {
    method: "PATCH",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al marcar hábito");
  }

  return data;
};