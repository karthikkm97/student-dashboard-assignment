import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  PieChart,
  Settings,
} from 'lucide-react';
import logo from '../image/logo.png';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: Users, label: 'Students', active: true },
  { icon: BookOpen, label: 'Chapter', active: false },
  { icon: HelpCircle, label: 'Help', active: false },
  { icon: PieChart, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="Logo" className="h-8 w-15 object-cover" />
        </div>
        {/* Navigation */}
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            // eslint-disable-next-line
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                item.active
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  item.active ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
