import { Tasks } from '../../../types/db-objects';
import { deleteTask, updateTaskCompleted } from '../../api';

interface Props {
  task: Tasks;
}

const Task = ({ task }: Props) => {
  return (
    <div className='flex w-3/4 mx-auto my-5 items-center'>
      <input
        className='cursor-pointer mr-5 w-5 h-5 rounded-2xl accent-green-400'
        type='checkbox'
        onClick={(event) => {
          event.preventDefault();
          updateTaskCompleted(task.id, task.completed);
        }}
        checked={task.completed}
      />
      <p
        className={
          'text-left mr-auto ' +
          (task.completed ? 'text-gray-500' : 'text-black')
        }
      >
        {task.content}
      </p>
      <i
        className='text-red-500 hover:text-red-700 cursor-pointer'
        onClick={() => deleteTask(task.id)}
      >
        X
      </i>
    </div>
  );
};

export default Task;
