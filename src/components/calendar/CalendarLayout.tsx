import NavBar from "../navbars/NavBar";
import SideBar from "../navbars/SideBar";
import TaskCalendar from "./TaskCalendar";

const CalendarLayout = () => {
  return (
    <>
      <NavBar />
      <div className="w-screen bg-neutral-800 h-[90vh] flex">
        <SideBar />

        <div className="w-[80vw] max-w-[1200px] flex flex-col items-center py-6 mx-auto">
          <TaskCalendar />
        </div>
      </div>
    </>
  );
};

export default CalendarLayout;
