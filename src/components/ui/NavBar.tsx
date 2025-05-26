import { AuthContext, DEFAULT_USER } from '@/providers/contexts';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const isUserLoggedIn = !!user.username;
  const navigate = useNavigate();
  return (
    <div className='w-screen h-[10vh] bg-[#353632] flex items-center'>
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
        {isUserLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger>{user.username}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Info</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className='text-gray-100 w-full'
                  onClick={() => {
                    setUser(DEFAULT_USER);
                    localStorage.removeItem('user');
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to='/user/login'>LOGIN</Link>
        )}
      </span>
    </div>
  );
};

export default NavBar;
