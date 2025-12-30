import { DBTask } from "../../types/db-objects";
import { deleteTask, updateTaskCompleted } from "../../api";
import { formatTime } from "@/utils/date";
import {
  useContext,
  useRef
} from "react";
import { ListContext } from "@/providers/contexts";

interface Props {
  task: DBTask;
  listId: string | undefined;
  update: (listId: string | undefined) => void;
}

const getTaskTextColor = (task: DBTask) => {
  if (task.hasDeadline) {
    return "text-red-500 font-semibold";
  } else if (task.completed) {
    return "text-gray-400";
  } else {
    return "text-gray-100";
  }
};

const Task = ({ task, listId, update }: Props) => {
  const taskRef = useRef<HTMLInputElement>(null);

  const { isEditingTask, setIsEditingTask } = useContext(ListContext);
  const handleTaskEdit = async (
    event: FormEvent<HTMLFormElement>,
    titleRef: RefObject<HTMLInputElement | null>,
    inputRef: RefObject<HTMLInputElement | null>
  ) => {
    event.preventDefault();
    if (titleRef.current) {
      // setTitle(titleRef.current.value);
      // await updateListTitle(fetchedList?.id || "1", titleRef.current.value);
      // setTitle("");
      // setIsEditing(false);
      // await getList(fetchedList?.id);
      // await refetchLists();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex w-3/4 mx-auto my-5 items-center">
      <input
        // appearance-none
        className="cursor-pointer mr-5 w-5 h-5 rounded-2xl bg-gray-100 accent-green-400"
        type="checkbox"
        onChange={async () => {
          await updateTaskCompleted(task.id, Boolean(task.completed));
          update(listId);
        }}
        checked={Boolean(task.completed)}
      />
      {isEditingTask ?
        <p>works</p>
        // <form onSubmit={(event) => handleTaskEdit(event, titleRef, inputRef)}>
        //   <input
        //     className="text-gray-100 my-6 p-2 text-md"
        //     type="text"
        //     value={title}
        //     ref={titleRef}
        //     autoFocus
        //     onChange={(event) => setTitle(event.target.value)}
        //   />
        // </form>

        : (<p onDoubleClick={() => setIsEditingTask(true)} ref={taskRef} className={"text-left max-w-13/16 mr-auto " + getTaskTextColor(task)}>
          {task.hasDeadline ? `${formatTime(task.deadline)} - ` : ""}
          {task.content}
        </p>)}
      <i
        className="text-red-500 hover:text-red-700 cursor-pointer"
        onClick={async () => {
          await deleteTask(task.id);
          update(listId);
        }}
      >
        X
      </i>
    </div>
  );
};

export default Task;
