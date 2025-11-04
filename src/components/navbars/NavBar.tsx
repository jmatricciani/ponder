import { AuthContext, DEFAULT_USER } from "@/providers/contexts";
import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const isUserLoggedIn = !!user.username;
  const navigate = useNavigate();
  return (
    <div className="w-screen h-[10vh] max-h-[100px] bg-neutral-900 flex items-center">
      <Link className="mx-10" to="/">
        LOGO
      </Link>
      <span className="mr-auto">
        {isUserLoggedIn && (
          <>
            <Link className="mx-3" to="/journal">
              JOURNAL
            </Link>
            <Link className="mx-3" to="/tasks">
              TASKS
            </Link>
            <Link className="mx-3" to="/calendar">
              CALENDAR
            </Link>
          </>
        )}
      </span>
      <span className="mx-10 text-gray-100">
        {isUserLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex flex-row gap-2 items-center">
                <img className="w-5 h-5" src={user.image} alt="" />
                <span className="text-gray-100 hover:text-[#47a0a3] duration-500">
                  {user.alias ? user.alias : user.username}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/user/${user.id}`}>Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="text-gray-100 w-full"
                  onClick={() => {
                    setUser(DEFAULT_USER);
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/user/login">LOGIN</Link>
        )}
      </span>
    </div>
  );
};

export default NavBar;
