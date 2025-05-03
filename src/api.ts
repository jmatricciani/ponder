import {
  DBJournalEntry,
  DBTask,
  DBTaskList,
  TJournalEntry,
  TTask,
  TTaskList,
} from "./types/db-objects";

export const baseUrl = "http://localhost:3000";

//JOURNAL

export const postJournalEntry = async (entry: TJournalEntry) => {
  return await fetch(`${baseUrl}/journal-entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
};

export const getAllJournalEntries = async (): Promise<DBJournalEntry[]> => {
  const response = await fetch(`${baseUrl}/journal-entries`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<DBJournalEntry[]>;
};

export const getJournalEntry = async (id: string): Promise<DBJournalEntry> => {
  const response = await fetch(`${baseUrl}/journal-entries/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<DBJournalEntry>;
};

//TASKS

export const getAllTasks = async (): Promise<DBTask[]> => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<DBTask[]>;
};

export const postTask = async (task: TTask) => {
  return await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
};

export const deleteTask = async (id: string) => {
  await fetch(`${baseUrl}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

export const updateTaskCompleted = async (id: string, completed: boolean) => {
  await fetch(`${baseUrl}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }),
  });
};

// TASK LIST

export const postTaskList = async (list: TTaskList): Promise<DBTaskList> => {
  const response = await fetch(`${baseUrl}/task-lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });
  return response.json() as Promise<DBTaskList>;
};

export const getAllLists = async (): Promise<DBTaskList[]> => {
  const response = await fetch(`${baseUrl}/task-lists`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json() as Promise<DBTaskList[]>;
};

export const getTaskList = async (id: string): Promise<DBTaskList> => {
  const response = await fetch(`${baseUrl}/task-lists/${id}`, {
    method: "GET",
    headers: { "Conent-Type": "application/json" },
  });
  return response.json() as Promise<DBTaskList>;
};

export const deleteList = async (id: string): Promise<void> => {
  //get tasks by list_id
  const allTasks = await getAllTasks();
  const listTasks = allTasks.filter((task) => task.list_id === id);
  listTasks.map(async (task) => {
    await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  });
  await fetch(`${baseUrl}/task-lists/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

export const updateListTitle = async (id: string, title: string) => {
  await fetch(`${baseUrl}/task-lists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });
};
