export type JournalEntries = {
  user_id: number;
  content: string;
};

export type Tasks = {
  id: number;
  user_id: number;
  content: string;
  completed: boolean;
};
