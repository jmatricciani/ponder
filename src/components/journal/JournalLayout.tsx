import React from 'react';

// const myStyles = {
//   textIndent: '3em each-line',
// };

const JournalLayout = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold underline text-purple-400'>Journal</h1>
      <textarea
        className='bg-gray-50 text-black mt-5 text-xl p-5 indent-8'
        rows={30}
        cols={100}
        name='journal-entry'
        id='journal-entry'
      ></textarea>
    </div>
  );
};

export default JournalLayout;
