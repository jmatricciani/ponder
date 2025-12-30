import { createContext } from "react";
import { DBUser, TAuthContext } from "./AuthProvider";
import { TJournalContext } from "./JournalProvider";
import { DBJournalEntry, TTask } from "@/types/db-objects";
import { TListContext } from "./ListProvider";
import { TCalendarContext } from "./CalendarProvider";

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);
export const JournalContext = createContext<TJournalContext>(
  {} as TJournalContext
);
export const ListContext = createContext<TListContext>({} as TListContext);
export const CalendarContext = createContext<TCalendarContext>({} as TCalendarContext);

// Place all of the constants into their own config file
export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DEFAULT_IMAGE: string = "vite.svg";

export const DEFAULT_ENTRY: DBJournalEntry = {
  id: "",
  user_id: "",
  content: "",
  createdAt: "",
};

export const DEFAULT_USER: DBUser = {
  id: "",
  username: "",
  password: "",
  image: DEFAULT_IMAGE,
  alias: "",
  daysUntilEntryExpires: "never",
  daysUntilListExpires: "never",
  theme: "default",
};

export const DEFAULT_TASK: TTask = {
  user_id: "",
  list_id: "",
  content: "",
  completed: false,
  hasDeadline: false,
};
