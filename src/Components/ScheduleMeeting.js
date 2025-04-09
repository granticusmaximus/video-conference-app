import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ScheduleMeeting = () => {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const createMeeting = () => {
    if (!user) return alert("You must be logged in to create a meeting.");
    const id = uuidv4();
    setLink(`${window.location.origin}/meeting/${id}`);
  };

  const goToMeeting = () => {
    const id = link.split("/meeting/")[1];
    navigate(`/meeting/${id}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded bg-white text-center">
      <h2 className="text-xl font-semibold mb-4">📅 Schedule a Meeting</h2>
      <button onClick={createMeeting} className="bg-green-600 text-white px-4 py-2 rounded">
        Generate Meeting Link
      </button>

      {link && (
        <div className="mt-4">
          <input
            className="w-full border p-2 rounded text-sm"
            value={link}
            readOnly
          />
          <button onClick={goToMeeting} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Join Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;