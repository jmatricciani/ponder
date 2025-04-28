import { Link } from 'react-router';
import { DBJournalEntry, DBTaskList } from '../../types/db-objects';
import { dateToString } from '../../utils/date';
import { deleteList } from '../../api';

interface Props {
  content: DBJournalEntry[] | DBTaskList[];
  update: (listId: string | undefined) => void;
}

function isEntry(
  content: DBJournalEntry | DBTaskList
): content is DBJournalEntry {
  return (content as DBJournalEntry).createdAt !== undefined;
}

const SideBar = ({ content, update }: Props) => {
  return (
    <div className='bg-[#292929] flex flex-col w-[20vw]'>
      {content.map((entry) => (
        <Link
          key={entry.id}
          to={isEntry(entry) ? `/journal/${entry.id}` : `/tasks/${entry.id}`}
        >
          <p>
            {isEntry(entry)
              ? dateToString(new Date(entry.createdAt))
              : entry.title}
            <i
              className='text-red-500 hover:text-red-700 cursor-pointer'
              onClick={async () => {
                await deleteList(entry.id);
                update(entry.id);
              }}
            >
              X
            </i>
          </p>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
