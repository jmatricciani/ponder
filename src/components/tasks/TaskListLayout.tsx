import { FormEvent, useEffect, useRef, useState } from "react";
import { DBTask, DBTaskList, TTask } from "../../types/db-objects";
import toast from "react-hot-toast";
import {
  deleteList,
  getAllLists,
  getAllTasks,
  getTaskList,
  postTask,
  postTaskList,
  updateListTitle,
} from "../../api";
import Task from "./Task";
import NavBar from "../navbars/NavBar";
import SideBar from "../navbars/SideBar";
import { useNavigate, useParams } from "react-router";
import ButtonPrimary from "../buttons/ButtonPrimary";

const TaskListLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const defaultTask: TTask = {
    content: "",
    user_id: 1,
    completed: false,
    list_id: "1",
    hasDeadline: false,
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("new");
  const [tasks, setTasks] = useState<DBTask[]>([]);
  const [fetchedList, setList] = useState<DBTaskList>();
  const [lists, setLists] = useState<DBTaskList[]>([]);
  const [taskHasDeadline, setTaskHasDeadline] = useState<boolean>(false);
  const [taskDeadline, setTaskDeadline] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    getList(id);
    setIsEditing(false);
    // refetchLists();
    setTaskHasDeadline(false);
    setTaskDeadline("");
  }, [id]);

  useEffect(() => {
    if (fetchedList) {
      refetchTasks();
      setTitle(fetchedList.title);
    }
  }, [fetchedList]);

  useEffect(() => {
    refetchLists();
    refetchTasks();
  }, []);

  useEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [isSubmitting]);

  const refetchLists = async () => {
    const lists = await getAllLists();
    setLists(lists.filter((list) => !list.isDayList));
  };

  const refetchTasks = async () => {
    setTasks(await getAllTasks());
  };

  const getList = async (id: string | undefined) => {
    if (id) {
      setList(await getTaskList(id));
    }
  };

  const createNewList = async (): Promise<DBTaskList> => {
    return await postTaskList({
      user_id: "1",
      title: "new",
      isDayList: false,
    });
  };

  const handleCreateList = async () => {
    const list = await createNewList();
    refetchLists();
    navigate(`/tasks/${list.id}`);
  };

  const handleDeleteList = async (id: string) => {
    const list = await deleteList(id);
    console.log(list);
    // Navigate based on list type DayList -> calendar , TaskList -> tasks
    if (list.isDayList) navigate("/calendar");
    else navigate("/tasks");
    await refetchLists();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (content !== "") {
      defaultTask.content = content;
      defaultTask.list_id = fetchedList?.id || "1";
      defaultTask.hasDeadline = taskHasDeadline;
      defaultTask.deadline = taskDeadline;
      await postTask(defaultTask);
      toast.success("Task Saved!");
      setContent("");
      setTaskDeadline("");
      setTaskHasDeadline(false);
      await refetchTasks();
    }
    setIsSubmitting(false);
  };

  const handleTitleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleRef.current) {
      setTitle(titleRef.current.value);
      await updateListTitle(fetchedList?.id || "1", titleRef.current.value);
      setIsEditing(false);
      await getList(fetchedList?.id);
      await refetchLists();
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-screen bg-neutral-800 h-[90vh] flex">
        <SideBar taskLists={lists} id={id} />
        <div className="w-[80vw] max-w-[1200px] flex flex-col items-center py-6 mx-auto">
          {id ? (
            <>
              {isEditing ? (
                <form onSubmit={handleTitleEdit}>
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
                    onDoubleClick={() => setIsEditing(true)}
                  >
                    {fetchedList?.title}
                  </h2>
                  <button
                    className="text-sm text-red-600 m-5"
                    onClick={() => handleDeleteList(id)}
                  >
                    X
                  </button>
                </span>
              )}
              <div className="bg-neutral-800 w-3/4 h-[60vh] rounded-sm pt-3 overflow-y-auto">
                {tasks
                  .filter((task) => task.list_id === id)
                  .filter((task) => task.hasDeadline)
                  //better sorting method
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
          ) : (
            <>
              <ButtonPrimary onClickMethod={() => handleCreateList()}>
                Create List
              </ButtonPrimary>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskListLayout;
