import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TaskForm } from './components/task/TaskForm';
import { TaskDetail } from './components/task/TaskDetail';
import { Settings } from './components/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<TaskForm />} />
            <Route path="/edit/:taskId" element={<TaskForm />} />
            <Route path="/task/:taskId" element={<TaskDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
}
