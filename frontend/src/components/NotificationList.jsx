import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import socket from '../utils/socket';
import toast from 'react-hot-toast';

const NotificationList = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev].slice(0, 20));
      toast(notif.message, { icon: '🔔' });
    });

    return () => socket.off('notification');
  }, []);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Bell className="mr-2 text-primary-500" size={18} />
          Notifications
        </h3>
        <button 
          onClick={markAllRead}
          className="text-xs font-bold text-primary-600 hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-4 ${notif.read ? 'opacity-60' : ''}`}
            >
              <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${getIconColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold text-gray-900 ${notif.read ? '' : 'text-primary-600'}`}>{notif.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center">
                  <Clock size={10} className="mr-1" />
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!notif.read && (
                <button 
                  onClick={() => markRead(notif._id)}
                  className="mt-1 text-primary-500 hover:text-primary-700 p-1"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <Bell className="mx-auto text-gray-200 mb-2" size={32} />
            <p className="text-gray-400 text-sm font-medium">All caught up!</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-gray-50 text-center">
        <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-700">
          Close Panel
        </button>
      </div>
    </div>
  );
};

const getIcon = (type) => {
  switch (type) {
    case 'deadline': return <AlertTriangle size={14} />;
    case 'overdue': return <AlertTriangle size={14} />;
    case 'update': return <CheckCircle size={14} />;
    default: return <Info size={14} />;
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'deadline': return 'bg-amber-100 text-amber-600';
    case 'overdue': return 'bg-red-100 text-red-600';
    case 'update': return 'bg-emerald-100 text-emerald-600';
    default: return 'bg-blue-100 text-blue-600';
  }
};

export default NotificationList;
