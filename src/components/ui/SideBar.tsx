import { Link, NavigateFunction, useNavigate } from "react-router";
import { DBJournalEntry, DBTask, DBTaskList } from "../../types/db-objects";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { format } from "date-fns";

interface Props {
  journalEntries?: DBJournalEntry[];
  taskLists?: DBTaskList[];
  tasks?: DBTask[];
  id: string | undefined;
  update: (listId: string | undefined) => Promise<void>;
}

const displayJournalEntries = (journalEntries: DBJournalEntry[]) => {
  const dates = journalEntries.map((entry) => new Date(entry.createdAt));
  const months = Array.from(
    new Set(dates.map((date) => format(date, "MMMM y")))
  );
  console.log("display");
  return months.map((month) => (
    <Accordion className="text-gray-100 bg-[#242424]" type="single" collapsible>
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
                  <Link className="text-gray-100" to={`/journal/${entry.id}`}>
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
  tasks: DBTask[],
  navigate: NavigateFunction
) => {
  return taskLists.map((list) => (
    <Accordion className="text-gray-100 bg-[#242424]" type="single" collapsible>
      <AccordionItem value={list.id}>
        <AccordionTrigger>{list.title}</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1 items-start mx-8 text-left">
            <button
              className="self-end"
              onClick={() => {
                navigate(`/tasks/${list.id}`);
              }}
            >
              view &#62;
            </button>
            {tasks
              .filter((task) => task.list_id === list.id && !task.completed)
              .map((task) => (
                <li>&#x2022; {task.content}</li>
              ))}
            {tasks.filter((task) => task.list_id === list.id && !task.completed)
              .length === 0 && <li>All Tasks Completed</li>}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ));
};

const SideBar = ({ journalEntries, taskLists, tasks }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#292929] flex flex-col w-[20vw] overflow-y-auto">
      {journalEntries && displayJournalEntries(journalEntries)}
      {taskLists && tasks && displayTaskLists(taskLists, tasks, navigate)}
    </div>
  );
};

export default SideBar;
