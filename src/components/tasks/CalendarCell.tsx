import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}

const CalendarCell: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className = '',
}) => {
  return (
    <div className={clsx('h-full border-r border-b border-black', className)}>
      {children}
    </div>
  );
};

export default CalendarCell;
