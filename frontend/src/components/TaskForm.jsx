import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../store/taskSlice';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: 'Work',
    deadline: '',
  });

  if (!isOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask(taskData));
    setTaskData({ title: '', description: '', category: 'Work', deadline: '' });
    onClose();
    toast.success('Task created successfully');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-primary-600 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Create New Task</h2>
            <p className="text-primary-100 text-sm">Add a new item to your list</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Task Title</label>
            <input 
              type="text" 
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
            <textarea 
              placeholder="Add some details..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all min-h-[100px]"
              required
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                value={taskData.category}
                onChange={(e) => setTaskData({...taskData, category: e.target.value})}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Deadline</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all"
                required
                value={taskData.deadline}
                onChange={(e) => setTaskData({...taskData, deadline: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
