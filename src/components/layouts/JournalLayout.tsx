import { useContext, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import NavBar from "../navbars/NavBar";
import SideBar from "../navbars/SideBar";
import { dateToString } from "../../utils/date";
import { useNavigate, useParams } from "react-router";
import { wordCount } from "../../utils/string";
import { format } from "date-fns";
import ButtonPrimary from "../buttons/ButtonPrimary";
import ButtonInfo from "../buttons/ButtonInfo";
import { JournalContext } from "@/providers/contexts";
import { deleteEntry } from "@/api";

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    entry,
    entries,
    getEntry,
    content,
    setContent,
    handleSubmit,
    currentDateTime,
    refetchEntries,
  } = useContext(JournalContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEntry(id);
  }, [id, getEntry]);

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
        <SideBar journalEntries={entries} />
        <div className="w-[80vw] flex flex-col px-32 max-w-[1200px] py-10 mx-auto">
          <span className="flex flex-row justify-left gap-4">
            <h2 className="text-xl font-semibold text-gray-100 py-6">
              {entry
                ? format(
                  new Date(entry.createdAt),
                  "E, MMM dd, yyyy - h:mm aaa"
                )
                : dateToString(currentDateTime)}
            </h2>
            {entry && (
              <button
                className="text-xs text-red-600 m-5"
                onClick={async () => {
                  await deleteEntry(entry.id);
                  navigate("/journal");
                  await refetchEntries();
                }}
              >
                X
              </button>
            )}
          </span>
          {entry ? (
            <>
              <div className="text-base w-full h-[60vh] mx-auto mt-3 mb-3 overflow-y-auto text-left text-gray-100">
                {entry.content.split("\n").map((paragraph) => (
                  <p className="pb-2">{paragraph}</p>
                ))}
              </div>

              <div className="flex gap-8 w-3/4 items-center pt-6">
                <ButtonInfo icon="total-chars-icon">
                  {entry.content.length}
                </ButtonInfo>
                <ButtonInfo icon="total-words-icon">
                  {wordCount(entry.content)}
                </ButtonInfo>
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
                <ButtonPrimary onClickMethod={() => setContent("")}>
                  Start Over
                </ButtonPrimary>
                <ButtonInfo icon="total-chars-icon">
                  {content.length}
                </ButtonInfo>
                <ButtonInfo icon="total-words-icon">
                  {wordCount(content)}
                </ButtonInfo>
                <ButtonPrimary submit>Save</ButtonPrimary>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default JournalLayout;
