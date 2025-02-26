import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Login from './Account/Login';
import Register from './Account/Register';
import Profile from './Account/Profile';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-grow p-4">
          {/* Main content area */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
            {/* Add other routes here */}
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome to My React Video and Chat App!</h1>
              <p className="text-gray-700 text-center">This app is styled using Tailwind CSS.</p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;