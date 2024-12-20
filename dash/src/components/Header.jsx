import React from 'react';
import { Search, HelpCircle, MessageSquareText, Users, Bell } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gray rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative bg-white"> 
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" /> 
          <input
            type="text"
            placeholder="Search your course"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      {/* Icons and Profile */}
      <div className="flex items-center gap-5 ml-50">

      <button className="p-2 rounded-lg hover:bg-gray-100">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <MessageSquareText className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>

        </button>

        
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Users className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
            alt="Profile"
            className="h-8 w-8 rounded-md object-cover"
          />
          <div className="text-sm text-gray-700">
            <p className="font-medium leading-none">Adeline H. Dancy</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Header;
