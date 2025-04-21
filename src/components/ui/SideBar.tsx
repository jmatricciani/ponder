import { JournalEntries } from '../../types/db-objects';

interface Props {
  content: JournalEntries[];
}

const SideBar = ({ content }: Props) => {
  return (
    <div className='bg-[#292929] flex flex-col w-[20vw]'>
      {content.map((entry) => (
        <p key={entry.id}>{entry.createdAt}</p>
      ))}
    </div>
  );
};

export default SideBar;
