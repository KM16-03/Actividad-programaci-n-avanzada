type Habit = {
  _id: string;
  title: string;
  description: string;
};

type HabitListProps = {
  habits?: Habit[];
};

export default function HabitList({ habits = [] }: HabitListProps) {
  return (
    <div>
      {habits.map((habit) => (
        <div key={habit._id}>
          <h2>{habit.title}</h2>
          <p>{habit.description}</p>
        </div>
      ))}
    </div>
  );
}