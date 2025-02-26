import { Link } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex ${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-gray-800 text-white transition-width duration-300`}>
      {/* Sidebar content */}
      <div className="flex flex-col items-center justify-between p-4 w-full">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 hover:bg-blue-700 p-2 rounded-md w-full mb-4"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>

        <div className="space-y-4">
          <Link to="/login" className="text-white text-sm">
            {isCollapsed ? 'L' : 'Login'}
          </Link>
          <Link to="/register" className="text-white text-sm">
            {isCollapsed ? 'R' : 'Register'}
          </Link>
          <Link to="/profile" className="text-white text-sm">
            {isCollapsed ? 'P' : 'Profile'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;