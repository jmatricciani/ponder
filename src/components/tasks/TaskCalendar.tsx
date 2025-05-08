import { useEffect, useState } from "react";
import CalendarCell from "./CalendarCell";
import { dateToString } from "../../utils/date";
import {
  compareAsc,
  differenceInDays,
  endOfMonth,
  startOfMonth,
} from "date-fns";

const highlightCells = (date: Date, currentDate: Date) => {
  if (
    !compareAsc(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      )
    )
  )
    return "bg-red-300";
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TaskCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const firstOfMonth = startOfMonth(date);
  const lastOfMonth = endOfMonth(date);

  const daysInMonth = differenceInDays(lastOfMonth, firstOfMonth) + 1;

  const daysBeforeMonth = firstOfMonth.getDay();
  const daysAfterMonth = 6 - lastOfMonth.getDay();

  useEffect(() => {
    setDate(new Date());
  }, []);
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

        {Array.from({ length: daysInMonth }).map((_, index) => (
          <CalendarCell
            className={highlightCells(
              new Date(date.getFullYear(), date.getMonth(), index + 1),
              date
            )}
            key={index}
          >
            {index + 1}
          </CalendarCell>
        ))}

        {Array.from({ length: daysAfterMonth }).map((_, index) => (
          <CalendarCell key={index}></CalendarCell>
        ))}
      </div>
    </>
  );
};

export default TaskCalendar;
