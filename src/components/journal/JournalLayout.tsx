import { FormEvent, useRef, useState } from 'react';
import { JournalEntry } from '../../../types/db-objects';
import toast from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import { postJournalEntry } from '../../api';

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const entry: JournalEntry = { content: '', user_id: 1 };
  const [content, setContent] = useState('');

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
    <div>
      <h1 className='text-3xl font-bold underline text-purple-400'>Journal</h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <textarea
          className='bg-gray-50 text-black mt-5 text-xl p-5 indent-8'
          rows={10}
          cols={60}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          name='journal-entry'
          id='journal-entry'
        ></textarea>
        <div>
          <input
            type='submit'
            value='submit'
          />
        </div>
      </form>
    </div>
  );
};

export default JournalLayout;
