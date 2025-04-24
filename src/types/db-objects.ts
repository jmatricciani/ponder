export type TJournalEntry = {
  user_id: number;
  content: string;
  createdAt: Date;
};

export type DBJournalEntry = {
  id: string;
  user_id: string;
  content: string;
  createdAt: string;
};

export type TTask = {
  user_id: number;
  list_id: number;
  content: string;
  completed: boolean;
};

export type DBTask = {
  id: string;
  user_id: string;
  content: string;
  completed: string;
};

export type TTaskList = {
  user_id: number;
  title: string;
};

export type DBTaskList = {
  id: string;
  user_id: string;
  title: string;
};
