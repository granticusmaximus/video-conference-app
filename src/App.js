import { BrowserRouter as Router, Routes, Route, useParams, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/Profile";
import Chat from "./Components/Chat";
import VideoCall from "./Components/VideoCall";
import ScheduleMeeting from "./Components/ScheduleMeeting";
import Sidebar from "./Components/Sidebar";
import VerifyEmail from "./Components/VerifyEmail";

// Dummy homepage
const Home = () => (
  <div className="text-center text-2xl font-bold text-gray-700 mt-10">
    👋 Welcome to BlitzChat! Select an option from the sidebar.
  </div>
);

// Auth-protected route wrapper
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const MeetingWrapper = () => {
  const { id } = useParams();
  return <VideoCall roomId={id} />;
};

const Layout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-grow p-6 overflow-y-auto h-screen bg-gray-100">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* Sidebar layout */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            {/* Protected routes */}
            <Route
              path="/profile/:userId"
              element={<RequireAuth><ProfilePage /></RequireAuth>}
            />
            <Route
              path="/chat"
              element={<RequireAuth><Chat /></RequireAuth>}
            />
            <Route
              path="/schedule"
              element={<RequireAuth><ScheduleMeeting /></RequireAuth>}
            />
            <Route
              path="/meeting/:id"
              element={<RequireAuth><MeetingWrapper /></RequireAuth>}
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;