import './App.css';
import NavBar from './components/ui/NavBar';
import './styles.css';

function App() {
  return (
    <>
      <NavBar />
      <h1 className='text-3xl font-bold underline text-purple-400 bg-slate-700 flex justify-center items-center w-screen h-[90vh]'>
        Hello World!
      </h1>
    </>
  );
}

export default App;
