import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, PieChart, List } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/add', icon: <PlusCircle size={20} />, label: 'Add' },
    { to: '/analytics', icon: <PieChart size={20} />, label: 'Analytics' },
    { to: '/transactions', icon: <List size={20} />, label: 'All' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="text-3xl bg-gradient-to-r from-teal-400 to-amber-500 bg-clip-text text-transparent mt-1" style={{ fontFamily: "'Samarkan', sans-serif" }}>
          ₹upiya Budget
        </div>
        
        <div className="flex space-x-1 md:space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-800",
                isActive ? "bg-slate-800 text-teal-400" : "text-slate-400"
              )}
            >
              {item.icon}
              <span className="hidden md:inline font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
