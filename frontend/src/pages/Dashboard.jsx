import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  LayoutDashboard, CheckCircle, Clock, ListTodo, TrendingUp, 
  Calendar, Award, Activity 
} from 'lucide-react';
import API from '../api/axios';
import Spinner from '../components/Spinner';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);

  const fetchStats = async () => {
    try {
      const [overviewRes, categoryRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/categories')
      ]);
      setStats(overviewRes.data.data);
      setCategories(categoryRes.data.data.categories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Listen for real-time updates (if socket is integrated)
    // For now we will just poll or rely on manual refresh
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 font-medium">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Calendar className="text-primary-500" size={20} />
          <span className="text-sm font-bold text-gray-700">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats?.totalTasks} 
          icon={<ListTodo size={24} />} 
          color="bg-primary-50 text-primary-600"
          trend="+12% from last week"
        />
        <StatCard 
          title="Completed" 
          value={stats?.completedTasks} 
          icon={<CheckCircle size={24} />} 
          color="bg-emerald-50 text-emerald-600"
          trend="85% completion rate"
        />
        <StatCard 
          title="In Progress" 
          value={stats?.inProgressTasks} 
          icon={<Activity size={24} />} 
          color="bg-amber-50 text-amber-600"
          trend="Currently active"
        />
        <StatCard 
          title="Efficiency" 
          value={`${stats?.completionPercentage}%`} 
          icon={<TrendingUp size={24} />} 
          color="bg-violet-50 text-violet-600"
          trend="Top 10% of users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            < Award className="mr-2 text-primary-500" size={20} />
            Categories
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categories.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-gray-600 font-medium">{cat.name}</span>
                </div>
                <span className="text-gray-900 font-bold">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Overview Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <LayoutDashboard className="mr-2 text-primary-500" size={20} />
            Task Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Pending', value: stats?.pendingTasks },
                { name: 'In Progress', value: stats?.inProgressTasks },
                { name: 'Completed', value: stats?.completedTasks },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <p className="text-gray-500 text-sm font-bold">{title}</p>
    <h2 className="text-3xl font-black text-gray-900 mt-1">{value}</h2>
  </div>
);

export default Dashboard;
