import { useState } from 'react';
import { LogOut, User as UserIcon, Bell, Settings as SettingsIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import NotificationList from './NotificationList';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Productivity Hub
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <NotificationList isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
          <Link to="/settings" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">Settings</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 border border-primary-200">
              <UserIcon size={20} />
            </div>
          </Link>
          <button 
            onClick={onLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
