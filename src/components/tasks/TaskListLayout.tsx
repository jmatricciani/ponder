import { FormEvent, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DBTask, DBTaskList, TTask } from "../../types/db-objects";
import toast from "react-hot-toast";
import {
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

const TaskListLayout = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const task: TTask = {
    content: "",
    user_id: 1,
    completed: false,
    list_id: "1",
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
  }, [id]);

  useEffect(() => {
    refetchTasks(fetchedList?.id || "1");
    setTitle(fetchedList?.title || "?");
  }, [fetchedList]);

  useEffect(() => {
    refetchLists();
  }, []);

  useEffect(() => {
    inputRef.current?.scrollIntoView();
  }, [isSubmitting]);

  const refetchLists = async () => {
    setLists(await getAllLists());
  };

  const refetchTasks = async (id: string | undefined) => {
    setTasks((await getAllTasks()).filter((task) => task.list_id === id));
  };

  const getList = async (id: string | undefined) => {
    if (id) {
      setList(await getTaskList(id));
    } else {
      // const list = await createNewList();
      // setList(await getTaskList(list.id));
      // setList(DEFAULT_LIST);
    }
    // return fetchedList?.title || "?";
  };

  const createNewList = async (): Promise<DBTaskList> => {
    return await postTaskList({
      user_id: "1",
      title: "new",
    });
  };

  const handleCreateList = async () => {
    const list = await createNewList();
    //update sidebar
    refetchLists();
    navigate(`/tasks/${list.id}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (content !== "") {
      task.content = content;
      task.list_id = fetchedList?.id || "1";
      await postTask(task);
      toast.success("Task Saved!");
      setContent("");
      await refetchTasks(id || "1");
    }
    setIsSubmitting(false);
  };

  const handleTitleEdit = async () => {
    if (titleRef.current) {
      setTitle(titleRef.current.value);
      updateListTitle(fetchedList?.id || "1", titleRef.current.value);
      setIsEditing(false);
      getList(fetchedList?.id);
      //focus
      refetchLists();
    }
  };

  useHotkeys(
    "enter",
    (event) => {
      event.preventDefault();
      formRef.current?.requestSubmit();
      // if (titleRef.current) {
      handleTitleEdit();
      // }
    },
    {
      enableOnFormTags: ["INPUT"],
    }
  );
  return (
    <>
      <NavBar />
      <div className="w-screen h-[90vh] flex">
        <SideBar content={lists} update={refetchLists} />
        {/* show different display when no id */}
        <div className="w-[80vw] flex flex-col items-center">
          {id ? (
            <>
              {isEditing ? (
                <input
                  className="bg-gray-200 text-black my-6 p-2 text-5xl"
                  type="text"
                  value={title}
                  ref={titleRef}
                  autoFocus
                  onChange={(event) => setTitle(event.target.value)}
                />
              ) : (
                <h2
                  className="text-5xl font-bold text-gray-100 py-6"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {fetchedList?.title}
                </h2>
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
              <h1>show button</h1>
              <button onClick={() => handleCreateList()}>Create</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskListLayout;
