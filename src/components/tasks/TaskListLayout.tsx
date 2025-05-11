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
import NavBar from "../ui/NavBar";
import SideBar from "../ui/SideBar";
import { useNavigate, useParams } from "react-router";
import TaskCalendar from "./TaskCalendar";

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
  const navigate = useNavigate();

  useEffect(() => {
    getList(id);
    setIsEditing(false);
    refetchLists();
  }, [id]);

  useEffect(() => {
    if (fetchedList) {
      refetchTasks(fetchedList.id);
      setTitle(fetchedList.title);
    }
  }, [fetchedList]);

  useEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [isSubmitting]);

  const refetchLists = async () => {
    const lists = await getAllLists();
    setLists(lists.filter((list) => !list.isDayList));
  };

  const refetchTasks = async (id: string | undefined) => {
    setTasks((await getAllTasks()).filter((task) => task.list_id === id));
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
    await deleteList(id);
    navigate("/tasks");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (content !== "") {
      defaultTask.content = content;
      defaultTask.list_id = fetchedList?.id || "1";
      await postTask(defaultTask);
      toast.success("Task Saved!");
      setContent("");
      await refetchTasks(id || "1");
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
      <div className="w-screen h-[90vh] flex">
        <SideBar content={lists} update={refetchLists} id={id} />
        <div className="w-[80vw] flex flex-col items-center">
          {id ? (
            <>
              {isEditing ? (
                <form onSubmit={handleTitleEdit}>
                  <input
                    className="bg-gray-200 text-black my-6 p-2 text-5xl"
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
                    className="text-5xl font-bold text-gray-100 py-6"
                    onDoubleClick={() => setIsEditing(true)}
                  >
                    {fetchedList?.title}
                  </h2>
                  <button
                    className="text-5xl text-red-600 m-5"
                    onClick={() => handleDeleteList(id)}
                  >
                    X
                  </button>
                </span>
              )}
              <div className="bg-gray-50 w-3/4 h-[60vh] mt-5 pt-10 overflow-y-auto">
                {tasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    listId={fetchedList?.id}
                    update={refetchTasks}
                  />
                ))}
                <form ref={formRef} onSubmit={handleSubmit}>
                  <input
                    className="bg-gray-200 text-black p-2 w-3/4 mb-4"
                    type="text"
                    value={content}
                    ref={inputRef}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </form>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => handleCreateList()}>Create</button>
              <TaskCalendar />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskListLayout;
