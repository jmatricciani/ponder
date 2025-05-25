import { getAllUsers, postUser } from '@/api';
import { AuthContext } from '@/providers/AuthProvider';
import { FormEvent, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router';

const UserLayout = () => {
  const location = useLocation();
  const method = location.pathname.split('/')[2];
  const isLogin = method === 'login';
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }, [method]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      const users = await getAllUsers();
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      console.log('Submitted');
      console.log(users);
      console.log(user);
      if (user) {
        setUser(user);
        toast.success('You are now logged in!');
        //redirect
        navigate('/');
      } else {
        toast.error('Incorrect Login Credentials');
      }
    } else {
      //validation
      const user = await postUser({ username: username, password: password });
      console.log('attempted post user');
      console.log(user);
    }
  };
  return (
    <div className='flex w-screen h-screen justify-center items-center bg-slate-700 text-slate-800'>
      <div className='w-1/3 h-5/8 bg-gray-100 rounded-2xl flex flex-col'>
        <h1 className='text-5xl text-slate-800 py-10'>
          {isLogin ? 'LOGIN' : 'REGISTER'}
        </h1>
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
          {!isLogin && (
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
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {isLogin ? (
          <span className='text-slate-800 my-2'>
            Not Signed Up? <Link to='/user/register'>Register</Link>
          </span>
        ) : (
          <span className='text-slate-800 my-2'>
            Already Registered? <Link to='/user/login'>Login</Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
