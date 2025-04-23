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

export type Tasks = {
  id: number;
  user_id: number;
  content: string;
  completed: boolean;
};
