import { DBJournalEntry, TJournalEntry } from "@/types/db-objects";
import { JournalContext } from "./contexts";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { getAllJournalEntries, getJournalEntry, postJournalEntry } from "@/api";
import toast from "react-hot-toast";

export type TJournalContext = {
  entry: DBJournalEntry | undefined;
  entries: DBJournalEntry[];
  content: string;
  currentDateTime: Date;
  getEntry: (id: string | undefined) => Promise<void>;
  refetchEntries: () => Promise<void>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entry, setEntry] = useState<DBJournalEntry | undefined>(undefined);
  const [content, setContent] = useState<string>("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [entries, setEntries] = useState<DBJournalEntry[]>([]);

  const getEntry = async (id: string | undefined) => {
    if (id) {
      setEntry(await getJournalEntry(id));
    } else {
      setEntry(undefined);
    }
  };

  const refetchEntries = async () => {
    setEntries(await getAllJournalEntries());
  };

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refetchEntries();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry: TJournalEntry = {
      content: content,
      createdAt: new Date(),
      user_id: 1,
    };
    await postJournalEntry(entry);
    toast.success("Journal Entry Saved!");
    setContent("");
    await refetchEntries();
  };

  return (
    <JournalContext.Provider
      value={{
        entry,
        entries,
        currentDateTime,
        content,
        getEntry,
        setContent,
        handleSubmit,
        refetchEntries,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export default JournalProvider;
