import { FormEvent, useRef, useState } from 'react';
import { JournalEntries } from '../../types/db-objects';
import toast from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import { postJournalEntry } from '../../api';
import NavBar from '../ui/NavBar';
import SideBar from '../ui/SideBar';
import { dateToString } from '../../utils/date';

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const entry: JournalEntries = { content: '', user_id: 1 };
  const [content, setContent] = useState('');
  const [dateTime, setDateTime] = useState(new Date());

  setInterval(() => setDateTime(new Date()), 1000);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    entry.content = content;
    postJournalEntry(entry);
    toast.success('Journal Entry Saved!');
    setContent('');
  };

  useHotkeys(
    'ctrl+s',
    (event) => {
      event.preventDefault();
      formRef.current?.requestSubmit();
    },
    {
      enableOnFormTags: ['TEXTAREA'],
    }
  );

  return (
    <>
      <NavBar />
      <div className='w-screen h-[90vh] flex'>
        <SideBar />
        <div className='w-[80vw] flex flex-col'>
          <h2 className='text-5xl font-bold text-gray-100 py-6'>
            {dateToString(dateTime)}
          </h2>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <textarea
              className='bg-gray-50 text-black mt-5 text-xl p-5 w-3/4 h-[60vh] indent-8 resize-none'
              value={content}
              onChange={(event) => setContent(event.target.value)}
              name='journal-entry'
              id='journal-entry'
            ></textarea>
            <div className='flex place-content-around'>
              <input
                type='submit'
                value='submit'
              />
              <span>Character Count: {content.length}</span>
              <span>
                Word Count:{' '}
                {content.split(/\s+/).filter((element) => element != '').length}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JournalLayout;
