import { FormEvent, useEffect, useRef, useState } from "react";
import { DBJournalEntry, TJournalEntry } from "../../types/db-objects";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import {
  deleteEntry,
  getAllJournalEntries,
  getJournalEntry,
  postJournalEntry,
} from "../../api";
import NavBar from "../ui/NavBar";
import SideBar from "../ui/SideBar";
import { dateToString } from "../../utils/date";
import { useNavigate, useParams } from "react-router";
import { wordCount } from "../../utils/string";
import { format } from "date-fns";

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [entries, setEntries] = useState<DBJournalEntry[]>([]);
  const [fetchedEntry, setEntry] = useState<DBJournalEntry>();
  const { id } = useParams();
  const entry: TJournalEntry = {
    content: "",
    user_id: 1,
    createdAt: currentDateTime,
  };
  const navigate = useNavigate();

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
    getEntry(id);
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refetchEntries();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    entry.content = content;
    entry.createdAt = currentDateTime;
    await postJournalEntry(entry);
    toast.success("Journal Entry Saved!");
    setContent("");
    await refetchEntries();
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      formRef.current?.requestSubmit();
    },
    {
      enableOnFormTags: ["TEXTAREA"],
    }
  );

  return (
    <>
      <NavBar />
      <div className="w-screen h-[90vh] bg-neutral-800 flex">
        <SideBar id={id} journalEntries={entries} update={refetchEntries} />
        <div className="w-[80vw] flex flex-col px-32 max-w-[1200px] py-10 mx-auto">
          <span className="flex flex-row justify-left gap-4">
            <h2 className="text-lg font-semibold text-gray-100 py-6">
              {fetchedEntry
                ? format(
                    new Date(fetchedEntry.createdAt),
                    "E, MMM dd, yyyy - h:mm aaa"
                  )
                : dateToString(currentDateTime)}
            </h2>
            {fetchedEntry && (
              <button
                className="text-xs text-red-600 m-5"
                onClick={async () => {
                  await deleteEntry(fetchedEntry.id);
                  navigate("/journal");
                  await refetchEntries();
                }}
              >
                X
              </button>
            )}
          </span>
          {fetchedEntry ? (
            <>
              <div className="text-base w-full h-[60vh] mx-auto mt-5 mb-4 overflow-y-auto text-left text-gray-100">
                {fetchedEntry.content.split("\n").map((paragraph) => (
                  <p className="pb-2">{paragraph}</p>
                ))}
              </div>

              <div className="flex place-content-around w-3/4 items-center m-auto">
                <span className="text-sm text-gray-100">
                  Character Count: {fetchedEntry.content.length}
                </span>
                <span className="text-sm text-gray-100">
                  Word Count: {wordCount(fetchedEntry.content)}
                </span>
              </div>
            </>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit}>
              <textarea
                autoFocus
                className="text-gray-100 text-base w-full border-none outline-none py-2 h-[50vh] resize-none mb-4 bg-neutral-800"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="What are you thinking about?.."
                name="journal-entry"
                id="journal-entry"
              ></textarea>

              <div className="flex w-3/4 items-center gap-8">
                <button
                  type="button"
                  className="text-white text-sm"
                  onClick={() => setContent("")}
                >
                  Start Over
                </button>
                <span className="text-gray-100 text-sm">
                  Character Count: {content.length}
                </span>
                <span className="text-gray-100 text-sm">
                  Word Count: {wordCount(content)}
                </span>
                <button type="submit" className="text-white text-base text-sm">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default JournalLayout;
