import NavBar from "../navbars/NavBar";
import SideBar from "../navbars/SideBar";
import { useParams } from "react-router";
import TaskList from "../tasks/TaskList";
import TaskCalendar from "../calendar/TaskCalendar";

const CalendarLayout = () => {
  const { id } = useParams();
  return (
    <>
      <NavBar />
      <div className="w-screen bg-neutral-800 h-[90vh] flex">
        <SideBar />

        <div className="w-[80vw] max-w-[1200px] flex flex-col items-center py-6 mx-auto">
          {id ?
            (<TaskList />)
            :
            (
              <>
                <TaskCalendar />
              </>
            )
          }

        </div>
      </div>
    </>
  );
};

export default CalendarLayout;
