import { FormEvent, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tasks } from '../../../types/db-objects';
import toast from 'react-hot-toast';
import { getAllTasks, postTask } from '../../api';
import Task from './Task';

const TaskListLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const task: Omit<Tasks, 'id'> = { content: '', user_id: 1, completed: false };
  const [content, setContent] = useState('');
  //get all tasks here...
  const [tasks, setTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    refetchData();
  });

  const refetchData = async () => {
    setTasks(await getAllTasks());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    task.content = content;
    postTask(task);
    toast.success('Task Saved!');
    setContent('');
  };

  useHotkeys(
    'enter',
    (event) => {
      event.preventDefault();
      formRef.current?.requestSubmit();
    },
    {
      enableOnFormTags: ['INPUT'],
    }
  );
  return (
    <div className='w-screen h-screen flex flex-col items-center'>
      <h1 className='text-3xl font-bold underline text-purple-400 my-4 p-4'>
        Task List
      </h1>
      <div className='bg-gray-50 w-1/2 h-5/6'>
        <h2 className='text-gray-700 text-3xl my-8'>Ponder</h2>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
          />
        ))}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <input
            className='bg-gray-200 text-black p-2 w-3/4'
            type='text'
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default TaskListLayout;
