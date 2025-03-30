import { BrowserRouter as Router, Routes, Route, useParams, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProfilePage from "./Components/Profile";
import Chat from "./Components/Chat";
import VideoCall from "./Components/VideoCall";
import ScheduleMeeting from "./Components/ScheduleMeeting";
import Sidebar from "./Components/Sidebar";

// Dummy homepage to display inside the layout
const Home = () => (
  <div className="text-center text-2xl font-bold text-gray-700 mt-10">
    👋 Welcome to BlitzChat! Select an option from the sidebar.
  </div>
);

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

          {/* Routes with sidebar layout */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/schedule" element={<ScheduleMeeting />} />
            <Route path="/meeting/:id" element={<MeetingWrapper />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;