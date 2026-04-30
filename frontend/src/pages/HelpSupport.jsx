import { HelpCircle, MessageCircle, Mail, Phone, ExternalLink, ChevronRight } from 'lucide-react';

const HelpSupport = () => {
  const faqs = [
    {
      q: "How do I change my task priority?",
      a: "The priority score is automatically calculated based on your task's deadline and status. Move a task to 'In Progress' or set a closer deadline to increase its priority."
    },
    {
      q: "Can I use the app offline?",
      a: "Productivity Hub requires an active internet connection to sync your tasks and real-time notifications with our servers."
    },
    {
      q: "How do I enable dark mode?",
      a: "Go to Settings > Preferences and select 'Dark Mode'. This will instantly switch the application theme."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Help & Support</h1>
        <p className="text-gray-500 font-medium text-lg">We're here to help you stay productive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
          <p className="text-sm text-gray-500">Chat with our experts 24/7.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
          <p className="text-sm text-gray-500">pavan@productivityhub.com</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
          <p className="text-sm text-gray-500">+1 (555) 0123-4567</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-900">{faq.q}</p>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary-600/20">
        <div>
          <h3 className="text-2xl font-bold">Still need help?</h3>
          <p className="text-primary-100 font-medium">Our documentation covers everything you need.</p>
        </div>
        <button className="flex items-center space-x-2 bg-white text-primary-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-primary-50 transition-all shadow-lg">
          <span>Documentation</span>
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default HelpSupport;
