import { format } from 'date-fns';
import { getAllLists } from '../api';
import { DBTaskList } from '../types/db-objects';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const dateToString = (date: Date, showMonthYear = false) => {
  return showMonthYear
    ? `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
    : `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }:${
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      }`;
};

export const getListOfDay = async (
  date: Date
): Promise<DBTaskList | undefined> => {
  const name = format(date, 'MM/dd/yy');
  const lists = await getAllLists();
  const listWithName = lists.filter((list) => list.title === name);
  return listWithName.length === 1 ? listWithName[0] : undefined;
};
