import { AuthContext } from '@/providers/AuthProvider';
import { useContext } from 'react';
import { Link } from 'react-router';

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const isUserLoggedIn = !!user.username;
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
      <span className='mx-10'>
        {isUserLoggedIn ? user.username : <Link to='/user/login'>LOGIN</Link>}
      </span>
    </div>
  );
};

export default NavBar;
