import { useState } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const { tasks } = useSelector(state => state.tasks);

  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const dayTasks = tasks.filter(t => 
        new Date(t.deadline).toDateString() === tileDate.toDateString()
      );
      
      if (dayTasks.length > 0) {
        return (
          <div className="flex justify-center mt-1 space-x-0.5">
            {dayTasks.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            ))}
          </div>
        );
      }
    }
  };

  const selectedDateTasks = tasks.filter(t => 
    new Date(t.deadline).toDateString() === date.toDateString()
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Project Calendar</h1>
        <p className="text-gray-500 font-medium mt-1">Keep track of every deadline and milestone.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden group">
          {/* Calendar decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            className="w-full border-none font-sans text-gray-900"
            nextLabel={<ChevronRight size={20} />}
            prevLabel={<ChevronLeft size={20} />}
            next2Label={null}
            prev2Label={null}
          />

          <style>{`
            .react-calendar { background: transparent; border: none; font-family: inherit; width: 100% !important; }
            .react-calendar__tile { padding: 1.5em 0.5em; border-radius: 20px; transition: all 0.2s; font-weight: 700; color: #374151; }
            .react-calendar__tile--active { background: #0ea5e9 !important; color: white !important; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.4); }
            .react-calendar__tile:enabled:hover { background: #f0f9ff; color: #0ea5e9; }
            .react-calendar__navigation button { font-weight: 900; color: #111827; font-size: 1.25rem; }
            .react-calendar__month-view__weekdays__weekday { color: #9ca3af; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; }
          `}</style>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl shadow-gray-900/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight">
                  {date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Schedule</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map(task => (
                  <div key={task._id} className="bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 uppercase">
                        {task.priority}
                      </span>
                      <Clock size={14} className="text-gray-500" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{task.title}</h4>
                    <div className="flex items-center text-xs text-gray-400">
                      <Flag size={12} className="mr-1" />
                      <span>{task.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-bold">No tasks scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-600 rounded-[40px] p-8 text-white shadow-xl shadow-primary-600/20 group cursor-pointer overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-black text-2xl mb-2 relative z-10">Monthly<br />Overview</h4>
            <p className="text-primary-100 font-bold text-sm relative z-10">You have {tasks.length} total tasks this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
