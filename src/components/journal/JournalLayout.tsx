import { FormEvent, useEffect, useRef, useState } from 'react';
import { DBJournalEntry, TJournalEntry } from '../../types/db-objects';
import toast from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  deleteEntry,
  getAllJournalEntries,
  getJournalEntry,
  postJournalEntry,
} from '../../api';
import NavBar from '../ui/NavBar';
import SideBar from '../ui/SideBar';
import { dateToString } from '../../utils/date';
import { useNavigate, useParams } from 'react-router';
import { wordCount } from '../../utils/string';
import { format } from 'date-fns';

const JournalLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [entries, setEntries] = useState<DBJournalEntry[]>([]);
  const [fetchedEntry, setEntry] = useState<DBJournalEntry>();
  const { id } = useParams();
  const entry: TJournalEntry = {
    content: '',
    user_id: 1,
    createdAt: currentDateTime,
  };
  const navigate = useNavigate();

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
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refetchEntries();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    entry.content = content;
    entry.createdAt = currentDateTime;
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
          journalEntries={entries}
          update={refetchEntries}
        />
        <div className='w-[80vw] flex flex-col bg-slate-700'>
          <span className='flex flex-row justify-center gap-4'>
            <h2 className='text-5xl font-bold text-gray-100 py-6'>
              {fetchedEntry
                ? format(
                    new Date(fetchedEntry.createdAt),
                    'E, MMM dd, yyyy - h:mm aaa'
                  )
                : dateToString(currentDateTime)}
            </h2>
            {fetchedEntry && (
              <button
                className='text-5xl text-red-600 m-5'
                onClick={async () => {
                  await deleteEntry(fetchedEntry.id);
                  navigate('/journal');
                  await refetchEntries();
                }}
              >
                X
              </button>
            )}
          </span>
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
                <span className='text-xl text-gray-100'>
                  Character Count: {fetchedEntry.content.length}
                </span>
                <span className='text-xl text-gray-100'>
                  Word Count: {wordCount(fetchedEntry.content)}
                </span>
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
                <span className='text-gray-100 text-lg'>
                  Character Count: {content.length}
                </span>
                <span className='text-gray-100 text-lg'>
                  Word Count: {wordCount(content)}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default JournalLayout;
