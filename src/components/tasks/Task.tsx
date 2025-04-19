import { Tasks } from '../../../types/db-objects';
import { deleteTask, updateTaskCompleted } from '../../api';

interface Props {
  task: Tasks;
}

const Task = ({ task }: Props) => {
  return (
    <div className='flex place-content-around w-3/4'>
      <input
        type='checkbox'
        onClick={(event) => {
          event.preventDefault();
          updateTaskCompleted(task.id, task.completed);
        }}
        checked={task.completed}
      />
      <p className='text-black'>{task.content}</p>
      <i
        className='text-red-600'
        onClick={() => deleteTask(task.id)}
      >
        X
      </i>
    </div>
  );
};

export default Task;
