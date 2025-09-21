import { useEffect, useState } from "react";
import CalendarCell from "./CalendarCell";
import { dateToString } from "../../utils/date";
import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  startOfMonth,
  sub,
} from "date-fns";
import { DBTask, DBTaskList } from "../../types/db-objects";
import { getAllLists, getAllTasks } from "../../api";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const PREV_DAY_LIMIT = 3;

const TaskCalendar = () => {
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

  //fix this
  // const isPrevDayList = (date: Date, currentDate: Date) => {
  //   //make sure that a day list for the day actually exists
  //   const diffInDays = differenceInDays(date, currentDate);
  //   if (diffInDays < 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const listHasDeadline = (date: string) => {
    const list = getListByDate(date);
    const tasks = getTasksByListId(list.id);
    return tasks.filter((task) => task.hasDeadline).length > 0 ? true : false;
  };

  useEffect(() => {
    setDate(new Date()); //not really being used
    getDayLists();
    getTasks();
  }, []);

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
  };
  return (
    <>
      <div className="flex flex-row items-center gap-5">
        <button
          className="h-1/2 text-gray-100"
          onClick={() => {
            setDate(sub(date, { months: 1 }));
          }}
        >
          &#60;
        </button>
        <h2 className="text-xl font-bold text-gray-100 py-6">
          {dateToString(date, true)}
        </h2>
        <button
          className="h-1/2 text-gray-100"
          onClick={() => {
            setDate(add(date, { months: 1 }));
          }}
        >
          &#62;
        </button>
      </div>
      <div className="h-8 bg-neutral-700 text-gray-100 w-3/4 grid grid-cols-7 items-center">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="bg-neutral-700 text-gray-100 border-gray-400 border-t border-l w-3/4 h-[60vh] max-h-[600px] overflow-y-none grid grid-cols-7">
        {Array.from({ length: daysBeforeMonth }).map((_, index) => (
          <CalendarCell key={index}></CalendarCell>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const cellDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            index + 1
          );

          const list = getListByDate(format(cellDate, "MM/dd/yy"));
          const tasks = list ? getTasksByListId(list.id) : [];
          const filterDeadlines = tasks.filter((task) => task.hasDeadline);
          const deadlines =
            filterDeadlines.length > 0
              ? filterDeadlines.sort((a, b) => {
                  const timeA = a.deadline?.split(":");
                  const timeB = b.deadline?.split(":");
                  if (timeA && timeB) {
                    if (timeA[0] === timeB[0]) {
                      return Number(timeA[1]) - Number(timeB[1]);
                    } else {
                      return Number(timeA[0]) - Number(timeB[0]);
                    }
                  }
                  return 0;
                })
              : undefined;
          return (
            <CalendarCell
              className={highlightCells(cellDate)}
              date={cellDate}
              key={index}
              deadlines={deadlines}
            >
              {index + 1}
            </CalendarCell>
          );
        })}

        {Array.from({ length: daysAfterMonth }).map((_, index) => (
          <CalendarCell key={index}></CalendarCell>
        ))}
      </div>
    </>
  );
};

export default TaskCalendar;
