import { Link, useNavigate } from "react-router";
import { DBJournalEntry, DBTaskList } from "../../types/db-objects";
import { dateToString } from "../../utils/date";
import { deleteList } from "../../api";

interface Props {
  content: DBJournalEntry[] | DBTaskList[];
  id: string | undefined;
  update: (listId: string | undefined) => void;
}

function isEntry(
  content: DBJournalEntry | DBTaskList
): content is DBJournalEntry {
  return (content as DBJournalEntry).createdAt !== undefined;
}

const SideBar = ({ content, update, id }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#292929] flex flex-col w-[20vw]">
      {content.map((item) => (
        <Link
          key={item.id}
          to={isEntry(item) ? `/journal/${item.id}` : `/tasks/${item.id}`}
        >
          <p>
            {isEntry(item)
              ? dateToString(new Date(item.createdAt))
              : item.title}
            <i
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={async () => {
                if (id === item.id) {
                  navigate("/tasks");
                  //this should work...
                  //run some console logs to be sure
                }
                await deleteList(item.id);
                // await deleteListItems(entry.id);
                update(item.id);
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
