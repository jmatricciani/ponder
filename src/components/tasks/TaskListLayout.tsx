import { FormEvent, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tasks } from '../../types/db-objects';
import toast from 'react-hot-toast';
import { getAllTasks, postTask } from '../../api';
import Task from './Task';
import NavBar from '../ui/NavBar';
import SideBar from '../ui/SideBar';

const TaskListLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const task: Omit<Tasks, 'id'> = { content: '', user_id: 1, completed: false };
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    refetchData();
  });

  const refetchData = async () => {
    setTasks(await getAllTasks());
    formRef.current?.lastElementChild?.scrollIntoView();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content !== '') {
      task.content = content;
      postTask(task);
      toast.success('Task Saved!');
      setContent('');
    }
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
    <>
      <NavBar />
      <div className='w-screen h-[90vh] flex'>
        <SideBar />
        <div className='w-[80vw] flex flex-col items-center'>
          <h2 className='text-5xl font-bold text-gray-100 py-6'>Ponder</h2>
          <div className='bg-gray-50 w-3/4 h-[60vh] mt-5 pt-10 overflow-y-auto'>
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
                className='bg-gray-200 text-black p-2 w-3/4 mb-4'
                type='text'
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskListLayout;
