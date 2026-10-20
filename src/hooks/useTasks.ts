import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { parseTasks, SEED_TASKS, type Task } from '../models/task';

const STORAGE_KEY = 'vibetracker.tasks';

/** Read tasks from localStorage, validating them; fall back to the seed tasks. */
function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return SEED_TASKS;
    const parsed = parseTasks(JSON.parse(raw));
    return parsed.length > 0 ? parsed : SEED_TASKS;
  } catch {
    return SEED_TASKS;
  }
}

/**
 * Typed task state that survives reloads.
 *
 * The return type is a tuple — a fixed-length array where each slot has its
 * own type — exactly like React's own `useState`:
 *   const [tasks, setTasks] = useTasks();
 *   setTasks(prev => [...prev, createTask({ title: 'New' })]);
 */
export function useTasks(): [Task[], Dispatch<SetStateAction<Task[]>>] {
  // Passing the function (not calling it) means it only runs on first render.
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* quota or private-mode error — ignore for the hackathon */
    }
  }, [tasks]);

  return [tasks, setTasks];
}
