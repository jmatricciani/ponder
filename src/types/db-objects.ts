export type JournalEntries = {
  id: number;
  user_id: number;
  content: string;
  createdAt: Date;
};

export type Tasks = {
  id: number;
  user_id: number;
  content: string;
  completed: boolean;
};
