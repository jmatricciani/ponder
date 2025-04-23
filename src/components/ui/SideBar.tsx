import { Link } from 'react-router';
import { DBJournalEntry } from '../../types/db-objects';
import { dateToString } from '../../utils/date';

interface Props {
  content: DBJournalEntry[];
}

const SideBar = ({ content }: Props) => {
  return (
    <div className='bg-[#292929] flex flex-col w-[20vw]'>
      {content.map((entry) => (
        <Link
          key={entry.id}
          to={`/journal/${entry.id}`}
        >
          <p>{dateToString(new Date(entry.createdAt))}</p>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
