import { Link } from 'react-router';

const NavBar = () => {
  return (
    <div className='w-screen h-[10vh] bg-[#353632] flex items-center'>
      <span className='mx-10'>LOGO</span>
      <span className='mr-auto'>
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
      </span>
      <span className='mx-10'>ACCOUNT</span>
    </div>
  );
};

export default NavBar;
