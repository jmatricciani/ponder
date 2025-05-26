import { getAllUsers, postUser, updateUserSettings } from '@/api';
import { AuthContext, DEFAULT_IMAGE } from '@/providers/contexts';
import { FormEvent, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ModeToggle } from '../ui/mode-toggle';

const AUTO_DELETE_OPTIONS = [
  { value: '-1', option: 'Never' },
  { value: '365', option: 'After a Year' },
  { value: '30', option: 'After a Month' },
  { value: '10', option: '10 days' },
  { value: '3', option: '3 days' },
  { value: '1', option: '1 day' },
];

const UserLayout = () => {
  const location = useLocation();
  const method = location.pathname.split('/')[2];
  const isLogin = method === 'login';
  const isRegister = method === 'register';
  const { user, setUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [alias, setAlias] = useState<string>('');
  const [daysUntilEntryExpires, setDaysUntilEntryExpires] =
    useState<string>('');
  const [daysUntilListExpires, setDaysUntilListExpires] = useState<string>('');

  useEffect(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
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
        toast.success('You are now logged in!');
        localStorage.setItem('user', JSON.stringify({ user: user.id }));
        navigate('/');
      } else {
        toast.error('Incorrect Login Credentials.');
      }
    }
    if (isRegister) {
      const user = await postUser({
        username: username,
        password: password,
        image: DEFAULT_IMAGE,
        alias: '',
        daysUntilEntryExpires: 'never',
        daysUntilListExpires: 'never',
        theme: 'default',
      });
      if (user) {
        setUser(user);
        toast.success('You have successfully registered!');
        localStorage.setItem('user', JSON.stringify({ user: user.id }));
        navigate('/');
      }
    }
  };

  const handleEditProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id) {
      await updateUserSettings(id, alias, daysUntilListExpires);
      setUser({
        ...user,
        alias: alias,
        daysUntilListExpires: daysUntilListExpires,
      });
      toast.success('Settings updated.');
    }
  };

  return (
    <div className='flex w-screen h-screen justify-center items-center bg-slate-700 text-slate-800'>
      <div className='w-1/3 h-5/8 bg-gray-100 rounded-2xl flex flex-col'>
        <div className='w-100 flex flex-row items-center justify-center'>
          <Link
            to='/'
            className='justify-start w-50'
          >
            &#60; back
          </Link>
          <h1 className='text-5xl text-slate-800 py-10 w-50 '>
            {isLogin && 'LOGIN'}
            {isRegister && 'REGISTER'}
            {id && `${user.alias ? alias : user.username}`}
          </h1>
        </div>
        {id && (
          <form
            className='flex flex-col gap-6 items-center'
            onSubmit={handleEditProfile}
          >
            <div className='flex flex-row items-center'>
              <span className='w-50 text-right pr-2'>Username:</span>
              <span className='w-50 text-left pl-2'>{user.username}</span>
            </div>
            <div className='flex flex-row items-center'>
              <span className='w-50 text-right pr-2'>Nickname:</span>
              <input
                type='text'
                placeholder='Optional Alias'
                className='w-50 bg-gray-200 p-2'
                value={alias}
                onChange={(event) => {
                  setAlias(event.target.value);
                }}
              />
            </div>
            <div className='flex flex-row items-center'>
              <span className='w-50 text-right pr-2'>Delete Old Lists:</span>
              <select
                name=''
                id=''
                className='w-50 bg-gray-200 p-2'
                onChange={(event) => {
                  setDaysUntilListExpires(event.target.value);
                }}
                defaultValue={daysUntilListExpires}
              >
                {AUTO_DELETE_OPTIONS.map((option, index) => (
                  <option
                    key={index}
                    value={option.value}
                  >
                    {option.option}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-row items-center'>
              <span className='w-50 text-right pr-2'>
                Delete Old Journal Entries:
              </span>
              <select
                name=''
                id=''
                className='w-50 bg-gray-200 p-2'
              >
                <option value='-1'>Never</option>
                <option value='365'>After a Year</option>
                <option value='30'>After a Month</option>
                <option value='10'>10 Days</option>
                <option value='3'>3 Days</option>
                <option value='1'>1 Day</option>
              </select>
            </div>
            <div className='flex flex-row items-center'>
              <span className='w-50 text-right pr-2'>Theme Select:</span>
              <span className='w-50'>
                <ModeToggle />
              </span>
            </div>
            <button
              className='text-gray-200'
              type='submit'
            >
              Save
            </button>
          </form>
        )}
        {(isLogin || isRegister) && (
          <form
            className='my-2 flex flex-col gap-6 items-center'
            action=''
            onSubmit={handleSubmit}
          >
            <input
              className='w-100 bg-gray-200 text-l p-4'
              type='text'
              placeholder='Username'
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              className='w-100 bg-gray-200 text-l p-4'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {isRegister && (
              <input
                className='w-100 bg-gray-200 text-l p-4'
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            )}
            <button
              className='text-gray-200'
              type='submit'
            >
              {isLogin && 'Login'}
              {isRegister && 'Register'}
            </button>
          </form>
        )}
        {isLogin && (
          <span className='text-slate-800 my-2'>
            Not Signed Up? <Link to='/user/register'>Register</Link>
          </span>
        )}
        {isRegister && (
          <span className='text-slate-800 my-2'>
            Already Registered? <Link to='/user/login'>Login</Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
