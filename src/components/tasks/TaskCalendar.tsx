import { useEffect, useState } from "react";
import CalendarCell from "./CalendarCell";
import { dateToString } from "../../utils/date";
import { differenceInDays, endOfMonth, format, startOfMonth } from "date-fns";
import { DBTaskList } from "../../types/db-objects";
import { getAllLists } from "../../api";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PREV_DAY_LIMIT = 3;

const TaskCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dayLists, setDayLists] = useState<DBTaskList[]>([]);
  const firstOfMonth = startOfMonth(date);
  const lastOfMonth = endOfMonth(date);

  const daysInMonth = differenceInDays(lastOfMonth, firstOfMonth) + 1;

  const daysBeforeMonth = firstOfMonth.getDay();
  const daysAfterMonth = 6 - lastOfMonth.getDay();

  const getDayLists = async () => {
    const lists = await getAllLists();
    setDayLists(lists.filter((list) => list.isDayList));
  };

  const isPrevDayList = (date: Date, currentDate: Date) => {
    //make sure that a day list for the day actually exists
    const diffInDays = differenceInDays(date, currentDate);
    if (diffInDays >= -PREV_DAY_LIMIT && diffInDays < 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setDate(new Date());
    getDayLists();
  }, []);

  const highlightCells = (date: Date, currentDate: Date) => {
    const lists = dayLists.map((list) => list.title);
    const hasList = lists.includes(format(date, "MM/dd/yy"));
    if (format(date, "MM/dd/yy") === format(currentDate, "MM/dd/yy")) {
      return "bg-blue-300";
    } else if (hasList && isPrevDayList(date, currentDate)) {
      return "bg-gray-300";
    } else if (hasList && differenceInDays(date, currentDate) >= 0) {
      //conditional should be > 0, look into this
      return "bg-green-300";
    }
  };
  return (
    <>
      <h2>{dateToString(date)}</h2>
      <div className="h-8 bg-gray-100 text-black w-3/4 grid grid-cols-7 items-center">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="bg-gray-50 text-black border-black border-t border-l w-3/4 h-[60vh] overflow-y-none grid grid-cols-7">
        {Array.from({ length: daysBeforeMonth }).map((_, index) => (
          <CalendarCell key={index}></CalendarCell>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const cellDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            index + 1
          );
          return (
            <CalendarCell
              className={highlightCells(cellDate, date)}
              date={cellDate}
              key={index}
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
