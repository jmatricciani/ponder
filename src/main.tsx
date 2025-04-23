import { createBrowserRouter, RouterProvider } from 'react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import JournalLayout from './components/journal/JournalLayout.tsx';
import { Toaster } from 'react-hot-toast';
import TaskListLayout from './components/tasks/TaskListLayout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/journal',
    Component: JournalLayout,
  },
  {
    path: '/journal/:id',
    Component: JournalLayout,
  },
  {
    path: '/tasks',
    Component: TaskListLayout,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
);
