export async function getHabits() {
  const response = await fetch("http://localhost:3001/habits");
  const data = await response.json();
  return data;
}