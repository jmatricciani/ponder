import clsx from 'clsx';
import React from 'react';
import { postTaskList } from '../../api';
import { DBTask, DBTaskList } from '../../types/db-objects';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { getListOfDay } from '../../utils/date';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { formatTime } from './Task';

interface Props {
  className?: string;
  date?: Date;
  deadlines?: DBTask[];
}

const createListOfDay = async (date: Date): Promise<DBTaskList> => {
  return await postTaskList({
    user_id: '1',
    title: format(date, 'MM/dd/yy'),
    isDayList: true,
  });
};

const CalendarCell: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  date,
  deadlines,
  className = '',
}) => {
  const navigate = useNavigate();
  const handleCellClick = async () => {
    if (date) {
      const list = await getListOfDay(date);
      if (!list) {
        const newList = await createListOfDay(date);
        navigate(`/tasks/${newList.id}`);
      } else {
        navigate(`/tasks/${list.id}`);
      }
    }
  };
  return deadlines ? (
    <HoverCard>
      <HoverCardTrigger>
        <div
          onClick={handleCellClick}
          className={clsx('h-full border-r border-b border-black', className)}
        >
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        {deadlines
          ? deadlines.map((task) => (
              <h6 className='text-red-600'>
                {formatTime(task.deadline) + ' - ' + task.content}
              </h6>
            ))
          : ''}
      </HoverCardContent>
    </HoverCard>
  ) : (
    <div
      onClick={handleCellClick}
      className={clsx('h-full border-r border-b border-black', className)}
    >
      {children}
    </div>
  );
};

export default CalendarCell;
