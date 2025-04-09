import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

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
          {/* Show Login/Register only if NOT logged in */}
          {!currentUser && (
            <>
              <Link
                to="/login"
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-green-400' : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isCollapsed ? 'L' : 'Login'}
              </Link>

              <Link
                to="/register"
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-red-400' : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isCollapsed ? 'R' : 'Register'}
              </Link>
            </>
          )}

          {/* Show links if logged in */}
          {currentUser && (
            <>
              <Link
                to={`/profile/${currentUser.uid}`}
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-gray-300' : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {isCollapsed ? 'P' : 'Profile'}
              </Link>

              <Link
                to="/chat"
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {isCollapsed ? 'C' : 'Chat'}
              </Link>

              <Link
                to="/schedule"
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-purple-400' : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isCollapsed ? 'S' : 'Schedule Meeting'}
              </Link>

              <button
                onClick={handleLogout}
                className={`text-center py-2 px-3 rounded-md ${
                  isCollapsed ? 'text-red-400' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isCollapsed ? '⏻' : 'Logout'}
              </button>
            </>
          )}
        </div>

        <div className="flex-grow" />
      </div>
    </div>
  );
};

export default Sidebar;