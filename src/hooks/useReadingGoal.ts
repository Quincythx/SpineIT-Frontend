import { useState } from 'react';

// Reading goals are a purely personal, client-side setting with no backend
// equivalent yet — stored per-user in localStorage rather than mock data,
// since they don't need to be shared with anyone else.
function storageKey(username: string) {
  return `spineit_reading_goal_${username}`;
}

export function useReadingGoal(username: string) {
  const [goal, setGoalState] = useState<number | null>(() => {
    const raw = localStorage.getItem(storageKey(username));
    return raw ? Number(raw) : null;
  });

  const setGoal = (value: number | null) => {
    if (value === null) {
      localStorage.removeItem(storageKey(username));
    } else {
      localStorage.setItem(storageKey(username), String(value));
    }
    setGoalState(value);
  };

  return { goal, setGoal };
}
