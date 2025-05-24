import { FormEvent, useEffect, useRef, useState } from 'react';
import { DBJournalEntry, TJournalEntry } from '../../types/db-objects';
import toast from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  getAllJournalEntries,
  getJournalEntry,
  postJournalEntry,
} from '../../api';
import NavBar from '../ui/NavBar';
import SideBar from '../ui/SideBar';
import { dateToString } from '../../utils/date';
import { useParams } from 'react-router';
import { wordCount } from '../../utils/string';

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [entries, setEntries] = useState<DBJournalEntry[]>([]);
  const [fetchedEntry, setEntry] = useState<DBJournalEntry>();
  const { id } = useParams();
  const entry: TJournalEntry = {
    content: '',
    user_id: 1,
    createdAt: dateTime,
  };

  const getEntry = async (id: string | undefined) => {
    if (id) {
      setEntry(await getJournalEntry(id));
    } else {
      setEntry(undefined);
    }
  };

  const refetchEntries = async () => {
    setEntries(await getAllJournalEntries());
  };

  useEffect(() => {
    getEntry(id);
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refetchEntries();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    entry.content = content;
    entry.createdAt = dateTime;
    await postJournalEntry(entry);
    toast.success('Journal Entry Saved!');
    setContent('');
    await refetchEntries();
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
        <SideBar
          id={id}
          content={entries}
          update={refetchEntries}
        />
        <div className='w-[80vw] flex flex-col bg-slate-700'>
          <h2 className='text-5xl font-bold text-gray-100 py-6'>
            {fetchedEntry
              ? dateToString(new Date(fetchedEntry.createdAt))
              : dateToString(dateTime)}
          </h2>
          {fetchedEntry ? (
            <>
              <div className='text-xl p-5 w-3/4 h-[60vh] indent-8 mx-auto mt-5 mb-4 overflow-y-auto text-left text-gray-100'>
                {fetchedEntry.content.split('\n').map((paragraph) => (
                  <p>
                    {paragraph}
                    <br />
                  </p>
                ))}
              </div>

              <div className='flex place-content-around w-3/4 items-center m-auto'>
                <span>Character Count: {fetchedEntry.content.length}</span>
                <span>Word Count: {wordCount(fetchedEntry.content)}</span>
              </div>
            </>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <textarea
                className='bg-gray-50 text-black mt-5 text-xl p-5 w-3/4 h-[60vh] indent-8 resize-none mb-4'
                value={content}
                onChange={(event) => setContent(event.target.value)}
                name='journal-entry'
                id='journal-entry'
              ></textarea>

              <div className='flex place-content-around w-3/4 items-center m-auto'>
                <button
                  type='button'
                  className='text-white'
                  onClick={() => setContent('')}
                >
                  New
                </button>

                <button
                  type='submit'
                  className='text-white'
                >
                  Save
                </button>
                <span>Character Count: {content.length}</span>
                <span>Word Count: {wordCount(content)}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default JournalLayout;
