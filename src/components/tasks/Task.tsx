import { DBTask } from '../../types/db-objects';
import { deleteTask, updateTaskCompleted } from '../../api';

export const formatTime = (time: string | undefined) => {
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);

    const period = hours < 12 || hours === 24 ? 'AM' : 'PM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }
};

interface Props {
  task: DBTask;
  listId: string | undefined;
  update: (listId: string | undefined) => void;
}

const getTaskTextColor = (task: DBTask) => {
  if (task.hasDeadline) {
    return 'text-red-500 font-semibold';
  } else if (task.completed) {
    return 'text-gray-500';
  } else {
    return 'text-black';
  }
};

const Task = ({ task, listId, update }: Props) => {
  return (
    <div className='flex w-3/4 mx-auto my-5 items-center'>
      <input
        className='cursor-pointer mr-5 w-5 h-5 rounded-2xl accent-green-400'
        type='checkbox'
        onChange={async () => {
          await updateTaskCompleted(task.id, Boolean(task.completed));
          update(listId);
        }}
        checked={Boolean(task.completed)}
      />
      <p className={'text-left max-w-13/16 mr-auto ' + getTaskTextColor(task)}>
        {task.hasDeadline ? `${formatTime(task.deadline)} - ` : ''}
        {task.content}
      </p>
      <i
        className='text-red-500 hover:text-red-700 cursor-pointer'
        onClick={async () => {
          await deleteTask(task.id);
          update(listId);
        }}
      >
        X
      </i>
    </div>
  );
};

export default Task;
