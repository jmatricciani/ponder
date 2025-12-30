import CalendarCell from "./CalendarCell";
import { dateToString } from "../../utils/date";
import {
  add,
  format,
  isAfter,
  isSameMonth,
  isSameYear,
  min,
  sub
} from "date-fns";
import {
  CalendarContext,
  DAYS_OF_WEEK
} from "@/providers/contexts";
import {
  useEffect,
  useContext
} from "react";
import toast from "react-hot-toast";

const TaskCalendar = () => {
  const {
    date,
    dayLists,
    setDate,
    highlightCells,
    daysBeforeMonth,
    daysAfterMonth,
    daysInMonth,
    getListByDate,
    getTasksByListId,
    getDayLists,
    getTasks,
  } = useContext(CalendarContext);

  useEffect(() => {
    getDayLists();
    getTasks();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center gap-5">
        <button
          className="h-1/2 flex"
          onClick={() => {
            const earliestDayList = min(dayLists.map((list) => new Date(list.title)));
            if (earliestDayList && isAfter(new Date(), earliestDayList)) {
              if (isSameMonth(earliestDayList, date) && isSameYear(earliestDayList, date)
              ) {
                toast.error('Can not make lists from the past');
              } else {
                setDate(sub(date, { months: 1 }));
              }
            }
            else if (isSameMonth(date, new Date())) {
              toast.error('Can not make lists from the past');
            }
            else {
              setDate(sub(date, { months: 1 }));
            }
          }}
        >
          <i className="chev-left self-center"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-100 py-6">
          {dateToString(date, true)}
        </h2>
        <button
          className="h-1/2 flex"
          onClick={() => {
            setDate(add(date, { months: 1 }));
          }}
        >
          <i className="chev-right self-center"></i>
        </button>
      </div>
      <div className="w-full flex flex-col items-center h-[65vh] max-h-[600px] overflow-y-auto">
        <div className="h-8 bg-neutral-700 text-gray-100 w-3/4 grid grid-cols-7 items-center">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="bg-neutral-700 text-gray-100 border-gray-400 border-t border-l w-3/4  grid grid-cols-7">
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
      </div>
    </>
  );
};

export default TaskCalendar;
