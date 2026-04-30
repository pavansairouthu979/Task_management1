import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from '../api/axios';
import { taskUpdated } from '../store/taskSlice';

const SortableItem = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-3 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{task.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center text-[10px] font-bold text-gray-400">
          <Clock size={12} className="mr-1" />
          <span>{new Date(task.deadline).toLocaleDateString()}</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
          U
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, title, tasks, icon, color }) => {
  return (
    <div className="flex-1 min-w-[320px] bg-gray-50/50 rounded-3xl p-4 border border-gray-100/50">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${color} shadow-sm`}>
            {icon}
          </div>
          <h3 className="font-black text-gray-900 tracking-tight">{title}</h3>
          <span className="bg-white border border-gray-100 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-lg">
            {tasks.length}
          </span>
        </div>
        <button className="p-1.5 hover:bg-white rounded-lg text-gray-400 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[500px]">
          {tasks.map(task => (
            <SortableItem key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const Kanban = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: 'Pending', title: 'To Do', icon: <Clock size={18} />, color: 'bg-amber-100 text-amber-600' },
    { id: 'In Progress', title: 'In Progress', icon: <AlertCircle size={18} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'Completed', title: 'Completed', icon: <CheckCircle2 size={18} />, color: 'bg-emerald-100 text-emerald-600' }
  ];

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(tasks.find(t => t._id === active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const task = tasks.find(t => t._id === active.id);
    const overId = over.id;

    // Logic to detect if dropped into a different column
    // For simplicity in this demo, we check the column ID
    const overColumn = columns.find(c => c.id === overId) || columns.find(c => tasks.find(t => t._id === overId)?.status === c.id);
    
    if (overColumn && task.status !== overColumn.id) {
      try {
        const res = await axios.put(`/api/tasks/${task._id}`, { status: overColumn.id });
        dispatch(taskUpdated(res.data));
      } catch (error) {
        console.error('Failed to update task status', error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Kanban Board</h1>
          <p className="text-gray-500 font-medium mt-1">Visualize and manage your workflow seamlessly.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                U
              </div>
            ))}
          </div>
          <button className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center space-x-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
            <Plus size={18} />
            <span>Invite Team</span>
          </button>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {columns.map(column => (
            <KanbanColumn 
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(t => t.status === column.id)}
              icon={column.icon}
              color={column.color}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-4 rounded-2xl border-2 border-primary-500 shadow-2xl opacity-90 rotate-3 cursor-grabbing w-[300px]">
               <h4 className="font-bold text-gray-900 text-sm mb-1">{activeTask.title}</h4>
               <p className="text-xs text-gray-500 line-clamp-2">{activeTask.description}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Kanban;
