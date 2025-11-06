import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import JournalLayout from "./components/journal/JournalLayout.tsx";
import { Toaster } from "react-hot-toast";
import TaskListLayout from "./components/tasks/TaskListLayout.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import UserLayout from "./components/user/UserLayout.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import CalendarLayout from "./components/calendar/CalendarLayout.tsx";
import JournalProvider from "./providers/JournalProvider.tsx";
import ListProvider from "./providers/ListProvider.tsx";
import CalendarProvider from "./providers/CalendarProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/journal",
    Component: JournalLayout,
  },
  {
    path: "/journal/:id",
    Component: JournalLayout,
  },
  {
    path: "/tasks",
    Component: TaskListLayout,
  },
  {
    path: "/tasks/:id",
    Component: TaskListLayout,
  },
  {
    path: "/calendar",
    Component: CalendarLayout,
  },
  {
    path: "/calendar/:id",
    Component: CalendarLayout,
  },
  {
    path: "/user",
    Component: UserLayout,
  },
  {
    path: "/user/login",
    Component: UserLayout,
  },
  {
    path: "/user/register",
    Component: UserLayout,
  },
  {
    path: "/user/:id",
    Component: UserLayout,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <JournalProvider>
        <ListProvider>
          <CalendarProvider>
            <ThemeProvider>
              <Toaster />
              <RouterProvider router={router} />
            </ThemeProvider>
          </CalendarProvider>
        </ListProvider>
      </JournalProvider>
    </AuthProvider>
  </StrictMode>
);
