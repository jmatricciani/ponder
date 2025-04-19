import { JournalEntries, Tasks } from '../types/db-objects';

export const baseUrl = 'http://localhost:3000';

export const postJournalEntry = async (entry: JournalEntries) => {
  return await fetch(`${baseUrl}/journal-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
};

export const getAllTasks = async (): Promise<Tasks[]> => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json() as Promise<Tasks[]>;
};

export const postTask = async (task: Omit<Tasks, 'id'>) => {
  return await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
};

export const deleteTask = async (id: number) => {
  await fetch(`${baseUrl}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const updateTaskCompleted = async (id: number, completed: boolean) => {
  await fetch(`${baseUrl}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed }),
  });
};
