import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`flex ${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-gray-900 text-white transition-all duration-300`}>
      <div className="flex flex-col justify-start p-4 w-full h-full">
        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 hover:bg-blue-700 p-2 rounded-md w-full mb-6"
        >
          {isCollapsed ? '☰' : 'Collapse'}
        </button>

        <div className="flex flex-col space-y-4">
          {/* Login Button */}
          <Link
            to="/login"
            className={`text-center py-2 px-3 rounded-md ${
              isCollapsed ? 'text-green-400' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isCollapsed ? 'L' : 'Login'}
          </Link>

          {/* Register Button */}
          <Link
            to="/register"
            className={`text-center py-2 px-3 rounded-md ${
              isCollapsed ? 'text-red-400' : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isCollapsed ? 'R' : 'Register'}
          </Link>

          {/* Profile Button (only show if user is logged in) */}
          {currentUser && (
            <Link
              to={`/profile/${currentUser.uid}`}
              className={`text-center py-2 px-3 rounded-md ${
                isCollapsed ? 'text-gray-300' : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              {isCollapsed ? 'P' : 'Profile'}
            </Link>
          )}
        </div>

        {/* Optional spacer */}
        <div className="flex-grow" />
      </div>
    </div>
  );
};

export default Sidebar;