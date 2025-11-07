import Task from "./Task";
import { ListContext } from "@/providers/contexts";
import {
  useRef, useContext, useEffect
} from "react";
import { useNavigate, useParams } from "react-router";
import { deleteList, postTask } from "@/api";
import { DEFAULT_TASK } from "@/providers/contexts";
import toast from "react-hot-toast";
import { FormEvent } from "react";
import { RefObject } from "react";
import { updateListTitle } from "@/api";

const TaskList = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchedList,
    isSubmitting,
    isEditing,
    title,
    tasks,
    content,
    taskHasDeadline,
    taskDeadline,
    refetchLists,
    setIsSubmitting,
    getList,
    setIsEditing,
    setTitle,
    setContent,
    setTaskHasDeadline,
    setTaskDeadline,
    refetchTasks,
  } = useContext(ListContext);

  useEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [isSubmitting]);

  useEffect(() => {
    getList(id);
  }, [id, getList]);

  const handleDeleteList = async () => {
    if (id) {
      const list = await deleteList(id);
      if (list.isDayList) navigate("/calendar");
      else navigate("/tasks");
      await refetchLists();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (content !== "") {
      DEFAULT_TASK.content = content;
      DEFAULT_TASK.list_id = fetchedList?.id || "1";
      DEFAULT_TASK.hasDeadline = taskHasDeadline;
      DEFAULT_TASK.deadline = taskDeadline;
      await postTask(DEFAULT_TASK);
      toast.success("Task Saved!");
      setContent("");
      setTaskDeadline("");
      setTaskHasDeadline(false);
      await refetchTasks();
    }
    setIsSubmitting(false);
  };

  const handleTitleEdit = async (
    event: FormEvent<HTMLFormElement>,
    reference: RefObject<HTMLInputElement | null>
  ) => {
    event.preventDefault();
    if (reference.current) {
      setTitle(reference.current.value);
      await updateListTitle(fetchedList?.id || "1", reference.current.value);
      setTitle("");
      setIsEditing(false);
      await getList(fetchedList?.id);
      await refetchLists();
    }
  };

  return (
    <>
      {isEditing ? (
        <form onSubmit={(event) => handleTitleEdit(event, titleRef)}>
          <input
            className="text-gray-100 my-6 p-2 text-md"
            type="text"
            value={title}
            ref={titleRef}
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <span className="flex">
          <h2
            className="text-lg font-bold text-gray-100 py-6"
            onDoubleClick={() => {
              if (fetchedList) {
                setTitle(fetchedList.title);
              }
              setIsEditing(true);
            }}
          >
            {fetchedList?.title}
          </h2>
          <button
            className="text-sm text-red-600 m-5"
            onClick={() => handleDeleteList()}
          >
            X
          </button>
        </span>
      )}
      <div className="bg-neutral-800 w-3/4 h-[60vh] rounded-sm pt-3 overflow-y-auto">
        {tasks
          .filter((task) => task.list_id === id)
          .filter((task) => task.hasDeadline)
          .sort((a, b) => {
            const timeA = a.deadline?.split(":");
            const timeB = b.deadline?.split(":");
            if (timeA && timeB) {
              if (timeA[0] === timeB[0]) {
                return Number(timeA[1]) - Number(timeB[1]);
              } else {
                return Number(timeA[0]) - Number(timeB[0]);
              }
            }
            return 0;
          })
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              listId={fetchedList?.id}
              update={refetchTasks}
            />
          ))}
        {tasks
          .filter((task) => task.list_id === id)
          .filter((task) => !task.hasDeadline)
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              listId={fetchedList?.id}
              update={refetchTasks}
            />
          ))}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <input
            className="bg-neutral-400 text-black rounded-xs p-2 w-3/4 mb-4 px-10"
            type="text"
            value={content}
            ref={inputRef}
            onChange={(event) => setContent(event.target.value)}
          />
          {fetchedList?.isDayList && (
            <input
              type="checkbox"
              className="absolute h-5 w-5 rounded-md accent-red-300 right-38 top-2.5"
              checked={taskHasDeadline}
              onChange={() => setTaskHasDeadline(!taskHasDeadline)}
            />
          )}
          {taskHasDeadline && (
            <input
              type="time"
              className="absolute h-14 right-12 top-9 p-4 px-8 bg-gray-300 text-black"
              value={taskDeadline}
              onChange={(event) => {
                setTaskDeadline(event.target.value);
              }}
            />
          )}
        </form>
      </div>
    </>
  )
}

export default TaskList;
