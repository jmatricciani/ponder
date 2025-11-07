import { useContext } from "react";
import NavBar from "../navbars/NavBar";
import SideBar from "../navbars/SideBar";
import { useNavigate, useParams } from "react-router";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { ListContext } from "@/providers/contexts";
import TaskList from "../tasks/TaskList";

const TaskListLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    lists,
    createNewList,
    refetchLists,
  } = useContext(ListContext);

  const handleCreateList = async () => {
    const list = await createNewList();
    refetchLists();
    navigate(`/tasks/${list.id}`);
  };

  return (
    <>
      <NavBar />
      <div className="w-screen bg-neutral-800 h-[90vh] flex">
        <SideBar taskLists={lists} />
        <div className="w-[80vw] max-w-[1200px] flex flex-col items-center py-6 mx-auto">
          {id ? (
            <TaskList />
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
