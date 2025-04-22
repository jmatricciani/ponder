import { JournalEntries } from '../../types/db-objects';
import { dateToString } from '../../utils/date';

interface Props {
  content: JournalEntries[];
}

const SideBar = ({ content }: Props) => {
  return (
    <div className='bg-[#292929] flex flex-col w-[20vw]'>
      {content.map((entry) => (
        //wrap this is a link tag and go to journal/{id}
        //Then create a display entry page, it will be similar to the create entry page but slightly different.
        //I will copy paste the functionality for now and maybe refactor later!
        <p key={entry.id}>{dateToString(new Date(entry.createdAt))}</p>
      ))}
    </div>
  );
};

export default SideBar;
