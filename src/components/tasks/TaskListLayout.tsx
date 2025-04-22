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
  const inputRef = useRef<HTMLInputElement>(null);
  const task: Omit<Tasks, 'id'> = { content: '', user_id: 1, completed: false };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    refetchTasks();
  }, []);

  useEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [isSubmitting]);

  const refetchTasks = async () => {
    setTasks(await getAllTasks());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (content !== '') {
      task.content = content;
      await postTask(task);
      toast.success('Task Saved!');
      setContent('');
      await refetchTasks();
    }
    setIsSubmitting(false);
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
        <SideBar content={[]} />
        <div className='w-[80vw] flex flex-col items-center'>
          <h2 className='text-5xl font-bold text-gray-100 py-6'>Ponder</h2>
          <div className='bg-gray-50 w-3/4 h-[60vh] mt-5 pt-10 overflow-y-auto'>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                update={refetchTasks}
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
                ref={inputRef}
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
