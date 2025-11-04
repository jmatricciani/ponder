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
  user_id: string;
  list_id: string;
  content: string;
  completed: boolean;
  hasDeadline: boolean;
  deadline?: string;
};

export type DBTask = {
  id: string;
  user_id: string;
  list_id: string;
  content: string;
  completed: boolean;
  hasDeadline: boolean;
  deadline?: string;
};

export type TTaskList = {
  user_id: string;
  title: string;
  isDayList: boolean;
};

export type DBTaskList = {
  id: string;
  user_id: string;
  title: string;
  isDayList: boolean;
};
