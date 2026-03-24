import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsDoneThunk, fetchAddHabitThunk, fetchHabitsThunk } from './features/habit/habitSlice';
import type { RootState, AppDispatch } from './store';

type Habit = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  days: number;
  lastDone: Date;
  lastUpdate: Date;
};

type HabitsProps = {
  habits: Habit[];
};

const handleMarkAsDone = (
  habitId: string,
  dispatch: AppDispatch,
  user: string
) => {
  dispatch(markAsDoneThunk({ habitId, token: user }));
};

const calculateProgress = (days: number): number => {
  return Math.min((days / 66) * 100, 100);
};

export default function Habits({ habits }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.habits);
  const user = useSelector((state: RootState) => state.user.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddHabit = () => {
    if (title && description) {
      dispatch(
        fetchAddHabitThunk({
          token: user ? user.toString() : '',
          title,
          description
        })
      );
      setTitle('');
      setDescription('');
      dispatch(fetchHabitsThunk(user ? user.toString() : ''));
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black mt-8">Habits</h1>

      <ul className="space-y-4 max-h-100 overflow-y-auto pt-4">
        {habits.length > 0 ? (
          habits.map((habit: Habit) => (
            <li
              className="flex items-center justify-between mt-2"
              key={habit._id}
            >
              <span className="text-black">{habit.title}</span>

              <div className="flex items-center space-x-2">
                <progress
                  className="w-24"
                  value={calculateProgress(habit.days)}
                  max="100"
                ></progress>

                <button
                  className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                  onClick={() =>
                    handleMarkAsDone(
                      habit._id,
                      dispatch,
                      user ? user.toString() : ''
                    )
                  }
                >
                  {status[habit._id] === 'loading'
                    ? 'Processing'
                    : 'Mark as Done'}
                </button>

                {status[habit._id] === 'failed' && (
                  <span className="text-red-500">{error[habit._id]}</span>
                )}

                {status[habit._id] === 'success' && (
                  <span className="text-green-500">Already marked as done</span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No habits available.</li>
        )}
      </ul>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-black">Agrega un habito nuevo</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleAddHabit}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}