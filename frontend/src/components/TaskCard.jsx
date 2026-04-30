import { Calendar, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../store/taskSlice';
import toast from 'react-hot-toast';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Completed': return { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={14} /> };
      case 'In Progress': return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={14} /> };
      default: return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertCircle size={14} /> };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id));
      toast.success('Task deleted successfully');
    }
  };

  const onStatusChange = (newStatus) => {
    dispatch(updateTask({ id: task._id, taskData: { status: newStatus } }));
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              const statuses = ['Pending', 'In Progress', 'Completed'];
              const nextIndex = (statuses.indexOf(task.status) + 1) % statuses.length;
              onStatusChange(statuses[nextIndex]);
            }}
            className={`flex items-center space-x-2 text-[10px] font-bold px-3 py-1 rounded-full border ${statusInfo.color} uppercase tracking-wider hover:opacity-80 transition-all`}
          >
            {statusInfo.icon}
            <span>{task.status}</span>
          </button>
          {task.priorityScore > 0 && (
            <div className="flex items-center space-x-1 text-[10px] font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200 uppercase tracking-wider">
              <TrendingUp size={12} />
              <span>Priority: {task.priorityScore}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-1">{task.title}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar size={14} className="text-primary-500" />
          <span className="text-xs font-medium">
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
          {task.category}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
