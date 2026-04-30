import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import Kanban from './pages/Kanban';
import CalendarPage from './pages/CalendarPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import socket from './utils/socket';
import { taskCreated, taskUpdated, taskDeleted } from './store/taskSlice';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('join', user._id);

      socket.on('taskCreated', (task) => dispatch(taskCreated(task)));
      socket.on('taskUpdated', (task) => dispatch(taskUpdated(task)));
      socket.on('taskDeleted', (id) => dispatch(taskDeleted(id)));

      // Apply theme
      if (user.preferences?.theme) {
        document.documentElement.classList.toggle('dark', user.preferences.theme === 'dark');
      }
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.disconnect();
    };
  }, [user, dispatch]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <Tasks />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kanban" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <Kanban />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <CalendarPage />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <Settings />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <div className="flex bg-gray-50 min-h-screen">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 max-w-7xl mx-auto">
                      <HelpSupport />
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
