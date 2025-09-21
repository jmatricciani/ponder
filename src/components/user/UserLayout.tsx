import {
  getAllUsers,
  postUser,
  updateUserProfileImage,
  updateUserSettings,
} from "@/api";
import { AuthContext, DEFAULT_IMAGE } from "@/providers/contexts";
import { FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ModeToggle } from "../ui/mode-toggle";

const AUTO_DELETE_OPTIONS = [
  { value: "-1", option: "Never" },
  { value: "365", option: "After a Year" },
  { value: "30", option: "After a Month" },
  { value: "10", option: "10 days" },
  { value: "3", option: "3 days" },
  { value: "1", option: "1 day" },
];

const UserLayout = () => {
  const location = useLocation();
  const method = location.pathname.split("/")[2];
  const isLogin = method === "login";
  const isRegister = method === "register";
  const { user, setUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [alias, setAlias] = useState<string>("");
  const [daysUntilEntryExpires, setDaysUntilEntryExpires] =
    useState<string>("");
  const [daysUntilListExpires, setDaysUntilListExpires] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [isEditAvatar, setIsEditAvatar] = useState<boolean>(false);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }, [method]);

  // useEffect(() => {
  // refetchUser(id);
  // }, [id]);

  useEffect(() => {
    // refetchUser(id);
    if (user) {
      setAlias(user.alias);
      setDaysUntilEntryExpires(user.daysUntilEntryExpires);
      setDaysUntilListExpires(user.daysUntilListExpires);
      setAvatar(user.image);
    } else {
      //nothing for now
    }
  }, [user, id]);

  // const refetchUser = async (id: string | undefined) => {
  //   if (id) {
  //     setUser(await getUserById(id));
  //   }
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      const users = await getAllUsers();
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        setUser(user);
        toast.success("You are now logged in!");
        localStorage.setItem("user", JSON.stringify({ user: user.id }));
        navigate("/");
      } else {
        toast.error("Incorrect Login Credentials.");
      }
    }
    if (isRegister) {
      const user = await postUser({
        username: username,
        password: password,
        image: DEFAULT_IMAGE,
        alias: "",
        daysUntilEntryExpires: "-1",
        daysUntilListExpires: "-1",
        theme: "default",
      });
      if (user) {
        setUser(user);
        toast.success("You have successfully registered!");
        localStorage.setItem("user", JSON.stringify({ user: user.id }));
        navigate("/");
      }
    }
  };

  const handleEditProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id) {
      await updateUserSettings(
        id,
        alias,
        daysUntilListExpires,
        daysUntilEntryExpires
      );
      setUser({
        ...user,
        alias: alias,
        daysUntilListExpires: daysUntilListExpires,
        daysUntilEntryExpires: daysUntilEntryExpires,
      });
      toast.success("Settings updated.");
    }
  };

  const handleEditProfileImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id) {
      //include file upload here...
      //pass image
      await updateUserProfileImage(id, avatar);
      setUser({
        ...user,
        image: avatar,
      });
      toast.success("Profile Image udpated.");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-neutral-800 text-gray-100">
      <div className="w-1/2 h-5/8 bg-neutral-700 rounded-md overflow-y-auto flex flex-col">
        <Link to="/" className="justify-start w-50 pt-10">
          &#60; back
        </Link>
        <div className="w-full flex flex-row items-center justify-center py-5 pb-10">
          {id && !isEditAvatar && (
            <img
              className="cursor-pointer hover:scale-130"
              src={avatar}
              onClick={() => {
                setIsEditAvatar(true);
              }}
            />
          )}
          <h2 className="text-3xl textgray-100 w-50 whitespace-nowrap ">
            {isLogin && "LOGIN"}
            {isRegister && "REGISTER"}
            {isEditAvatar && "PROFILE IMAGE"}
            {id && `${alias ? (isEditAvatar ? "" : alias) : user.username}`}
          </h2>
        </div>
        {id &&
          (isEditAvatar ? (
            <div className="flex flex-col gap-6 items-center">
              <form
                action=""
                className="w-50 h-50 flex flex-col gap-5"
                onSubmit={handleEditProfileImage}
              >
                <input
                  type="file"
                  onChange={(event) => setAvatar(event.target.value)}
                />

                <button type="submit" className="text-gray-100">
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <form
              className="flex flex-col gap-6 items-center"
              onSubmit={handleEditProfile}
            >
              <div className="flex flex-row items-center">
                <span className="w-50 text-right text-md pr-2">Username:</span>
                <span className="w-50 text-left pl-2">{user.username}</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="w-50 text-right text-md pr-2">Nickname:</span>
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-50 bg-neutral-600 rounded-sm p-2"
                  value={alias}
                  onChange={(event) => {
                    setAlias(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-row items-center">
                <span className="w-50 text-right pr-2 text-sm">
                  Delete Old Calendar Lists:
                </span>
                <select
                  name=""
                  id=""
                  className="w-50 bg-neutral-600 rounded-sm p-2"
                  onChange={(event) => {
                    setDaysUntilListExpires(event.target.value);
                  }}
                >
                  {AUTO_DELETE_OPTIONS.map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      selected={daysUntilListExpires === option.value}
                    >
                      {option.option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row items-center">
                <span className="w-50 text-right text-sm pr-2">
                  Delete Old Journal Entries:
                </span>
                <select
                  name=""
                  id=""
                  className="w-50 bg-neutral-600 rounded-sm p-2"
                  onChange={(event) => {
                    setDaysUntilEntryExpires(event.target.value);
                  }}
                >
                  {AUTO_DELETE_OPTIONS.map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      selected={daysUntilEntryExpires === option.value}
                    >
                      {option.option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row items-center">
                <span className="w-50 text-right pr-2">Theme Select:</span>
                <span className="w-50">
                  <ModeToggle />
                </span>
              </div>
              <button className="text-gray-200 mb-5" type="submit">
                Save
              </button>
            </form>
          ))}
        {(isLogin || isRegister) && (
          <form
            className="my-2 flex flex-col gap-6 items-center"
            action=""
            onSubmit={handleSubmit}
          >
            <input
              className="w-100 bg-gray-200 text-l p-4"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              className="w-100 bg-gray-200 text-l p-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {isRegister && (
              <input
                className="w-100 bg-gray-200 text-l p-4"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            )}
            <button className="text-gray-200" type="submit">
              {isLogin && "Login"}
              {isRegister && "Register"}
            </button>
          </form>
        )}
        {isLogin && (
          <span className="text-slate-800 my-2">
            Not Signed Up? <Link to="/user/register">Register</Link>
          </span>
        )}
        {isRegister && (
          <span className="text-slate-800 my-2">
            Already Registered? <Link to="/user/login">Login</Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
