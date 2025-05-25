import { AuthContext, DEFAULT_USER } from '@/providers/contexts';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const isUserLoggedIn = !!user.username;
  const navigate = useNavigate();
  return (
    <div className='w-screen h-[10vh] bg-[#353632] flex items-center'>
      {/* <span className='mx-10'>LOGO</span> */}
      <Link
        className='mx-10'
        to='/'
      >
        LOGO
      </Link>
      <span className='mr-auto'>
        {isUserLoggedIn && (
          <>
            <Link
              className='mx-3'
              to='/tasks'
            >
              TASKS
            </Link>
            <Link
              className='mx-3'
              to='/journal'
            >
              JOURNAL
            </Link>
          </>
        )}
      </span>
      <span className='mx-10 text-gray-100'>
        {isUserLoggedIn ? user.username : <Link to='/user/login'>LOGIN</Link>}
        {isUserLoggedIn ? (
          <button
            className='ml-5'
            onClick={() => {
              setUser(DEFAULT_USER);
              localStorage.removeItem('user');
              navigate('/');
            }}
          >
            Logout
          </button>
        ) : (
          ''
        )}
      </span>
    </div>
  );
};

export default NavBar;
