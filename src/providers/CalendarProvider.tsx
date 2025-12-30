import { useEffect, useState, ReactNode } from "react";
import {
  DBTask,
  DBTaskList
} from "@/types/db-objects";
import { CalendarContext } from "./contexts";
import {
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth
} from "date-fns";
import {
  getAllLists,
  getAllTasks
} from "@/api";

export type TCalendarContext = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  dayLists: DBTaskList[];
  setDayLists: React.Dispatch<React.SetStateAction<DBTaskList[]>>;
  allTasks: DBTask[];
  setAllTasks: React.Dispatch<React.SetStateAction<DBTask[]>>;
  listHasDeadline: (date: string) => boolean;
  highlightCells: (cellDate: Date) => string | undefined;
  daysInMonth: number;
  daysBeforeMonth: number;
  daysAfterMonth: number;
  getListByDate: (date: string) => DBTaskList;
  getTasksByListId: (id: string) => DBTask[];
  getDayLists: () => void;
  getTasks: () => void;
};

const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [dayLists, setDayLists] = useState<DBTaskList[]>([]);
  const [allTasks, setAllTasks] = useState<DBTask[]>([]);
  const firstOfMonth = startOfMonth(date);
  const lastOfMonth = endOfMonth(date);

  const daysInMonth = differenceInDays(lastOfMonth, firstOfMonth) + 1;

  const daysBeforeMonth = firstOfMonth.getDay();
  const daysAfterMonth = 6 - lastOfMonth.getDay();


  const getDayLists = async () => {
    const lists = await getAllLists();
    setDayLists(lists.filter((list) => list.isDayList));
  };

  const getTasks = async () => {
    const tasks = await getAllTasks();
    setAllTasks(tasks);
  };

  const getListByDate = (date: string) => {
    return dayLists.filter((list) => list.title === date && list.isDayList)[0];
  };

  const getTasksByListId = (id: string) => {
    return allTasks.filter((task) => task.list_id === id);
  };

  const listHasDeadline = (date: string) => {
    const list = getListByDate(date);
    const tasks = getTasksByListId(list.id);
    return tasks.filter((task) => task.hasDeadline).length > 0 ? true : false;
  };

  const highlightCells = (cellDate: Date) => {
    const currentDate = new Date();
    const lists = dayLists.map((list) => list.title);
    const hasList = lists.includes(format(cellDate, "MM/dd/yy"));
    if (hasList && differenceInDays(cellDate, currentDate) < 0) {
      return "bg-gray-300 text-[#333] cursor-pointer";
    } else if (
      hasList &&
      listHasDeadline(format(cellDate, "MM/dd/yy")) &&
      differenceInDays(cellDate, currentDate) == 0
    ) {
      return "bg-red-400 text-[#333] cursor-pointer";
    } else if (
      format(cellDate, "MM/dd/yy") === format(currentDate, "MM/dd/yy")
    ) {
      return "bg-blue-300 text-[#333] cursor-pointer";
    } else if (hasList && listHasDeadline(format(cellDate, "MM/dd/yy"))) {
      return "bg-rose-300 text-[#333] cursor-pointer";
    } else if (hasList && differenceInDays(cellDate, currentDate) >= 0) {
      //conditional should be > 0, look into this
      return "bg-green-300 text-[#333] cursor-pointer";
    }
  }

  useEffect(() => {
    setDate(new Date()); //not really being used
    //   getDayLists();
    //   getTasks();
  }, []);

  return <CalendarContext.Provider
    value={{
      date,
      setDate,
      dayLists,
      setDayLists,
      allTasks,
      setAllTasks,
      listHasDeadline,
      highlightCells,
      daysBeforeMonth,
      daysAfterMonth,
      daysInMonth,
      getListByDate,
      getTasksByListId,
      getDayLists,
      getTasks
    }}
  >
    {children}
  </CalendarContext.Provider>

}

export default CalendarProvider;
