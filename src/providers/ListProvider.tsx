import React, { ReactNode, useEffect, useState } from "react";
import { ListContext } from "./contexts";
import { DBTask, DBTaskList } from "@/types/db-objects";
import { getAllLists, getAllTasks, getTaskList, postTaskList } from "@/api";

export type TListContext = {
  fetchedList: DBTaskList | undefined;
  isEditing: boolean;
  isEditingTask: boolean;
  isSubmitting: boolean;
  title: string;
  content: string;
  tasks: DBTask[];
  lists: DBTaskList[];
  dayLists: DBTaskList[];
  taskHasDeadline: boolean;
  taskDeadline: string;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingTask: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTaskHasDeadline: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskDeadline: React.Dispatch<React.SetStateAction<string>>;
  refetchTasks: () => Promise<void>;
  getList: (id: string | undefined) => Promise<void>;
  createNewList: () => Promise<DBTaskList>;
  refetchLists: () => Promise<void>;
  refetchDayLists: () => Promise<void>;
};
const ListProvider = ({ children }: { children: ReactNode }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("new");
  const [tasks, setTasks] = useState<DBTask[]>([]);
  const [fetchedList, setList] = useState<DBTaskList>();
  const [lists, setLists] = useState<DBTaskList[]>([]);
  const [dayLists, setDayLists] = useState<DBTaskList[]>([]);
  const [taskHasDeadline, setTaskHasDeadline] = useState<boolean>(false);
  const [taskDeadline, setTaskDeadline] = useState<string>("");

  useEffect(() => {
    refetchLists();
    refetchDayLists();
    refetchTasks();
  }, [fetchedList]);

  const refetchLists = async () => {
    const lists = await getAllLists();
    setLists(lists.filter((list) => !list.isDayList));
  };

  const refetchDayLists = async () => {
    const lists = await getAllLists();
    setDayLists(lists.filter((list) => list.isDayList));
  };

  const refetchTasks = async () => {
    setTasks(await getAllTasks());
  };

  const getList = async (id: string | undefined) => {
    if (id) {
      setList(await getTaskList(id));
    } else {
      // setList(new DBTaskList());
      console.log("HI!");
    }
  };

  const createNewList = async (): Promise<DBTaskList> => {
    return await postTaskList({
      user_id: "1",
      title: "new",
      isDayList: false,
    });
  };

  return (
    <ListContext.Provider
      value={{
        fetchedList,
        isEditing,
        isEditingTask,
        isSubmitting,
        title,
        content,
        tasks,
        lists,
        dayLists,
        taskHasDeadline,
        taskDeadline,
        setIsEditing,
        setIsEditingTask,
        setContent,
        setTitle,
        setTaskDeadline,
        setTaskHasDeadline,
        refetchTasks,
        refetchLists,
        refetchDayLists,
        setIsSubmitting,
        getList,
        createNewList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListProvider;
