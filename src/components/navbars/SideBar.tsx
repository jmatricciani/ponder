import { Link, NavigateFunction, useNavigate } from "react-router";
import { DBJournalEntry, DBTaskList } from "../../types/db-objects";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { format } from "date-fns";
import ButtonSidebar from "../buttons/ButtonSidebar";
import { useContext } from "react";
import { ListContext } from "@/providers/contexts";

interface Props {
  journalEntries?: DBJournalEntry[];
  taskLists?: DBTaskList[];
}

const displayJournalEntries = (journalEntries: DBJournalEntry[]) => {
  const dates = journalEntries.map((entry) => new Date(entry.createdAt));
  const months = Array.from(
    new Set(dates.map((date) => format(date, "MMMM y")))
  );
  return months.map((month) => (
    <Accordion
      className="text-neutral-100 bg-[#242424]"
      type="single"
      collapsible
    >
      <AccordionItem value={month}>
        <AccordionTrigger>{month}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-1 text-md items-start indent-8">
            {journalEntries
              .filter((entry) => {
                const date = new Date(entry.createdAt);
                return format(date, "MMMM y") === month;
              })
              .map((entry) => {
                const date = new Date(entry.createdAt);
                return (
                  <Link
                    className="text-neutral-100"
                    to={`/journal/${entry.id}`}
                  >
                    {format(date, "E, MMM dd - h:mm aaa")}
                  </Link>
                );
              })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));
};

const displayTaskLists = (
  taskLists: DBTaskList[],
  navigate: NavigateFunction,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return taskLists.map((list) => (
    <>
      <ButtonSidebar onClickMethod={() => { navigate(`/tasks/${list.id}`); setIsEditing(false); }}>
        {list.title}
      </ButtonSidebar>
    </>
  ));
};

const SideBar = ({ journalEntries, taskLists }: Props) => {
  const navigate = useNavigate();
  const { setIsEditing } = useContext(ListContext);
  return (
    <div className="bg-[#242424] flex flex-col w-[20vw] overflow-y-auto">
      {journalEntries && displayJournalEntries(journalEntries)}
      {taskLists && displayTaskLists(taskLists, navigate, setIsEditing)}
    </div>
  );
};

export default SideBar;
