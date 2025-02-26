import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase.js';
import { ref, deleteObject } from 'firebase/storage';

const Profile = () => {
  const { userId } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null); // For uploading new profile picture

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUser = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setFormData(docSnap.data()); // Populate the form with the current user data
      }
    };
    fetchUser();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change (profile picture)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle saving the updated profile
  const handleSave = async () => {
    try {
      let profilePicUrl = formData.profilePic;
      
      // If there's a new profile picture, upload it
      if (file) {
        // Remove the old profile picture if it exists in storage
        if (user.profilePic) {
          const storageRef = ref(storage, user.profilePic);
          await deleteObject(storageRef); // Delete old picture
        }

        // Upload new profile picture to Firebase Storage
        const storageRef = ref(storage, `profile_pics/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        profilePicUrl = await getDownloadURL(snapshot.ref()); // Get the download URL
      }

      // Update user data in Firestore
      await updateDoc(doc(db, 'users', userId), {
        ...formData,
        profilePic: profilePicUrl,
      });

      setUser({ ...formData, profilePic: profilePicUrl }); // Update the user state
      setIsEditing(false); // Disable editing mode
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      
      <div className="flex items-center mb-4">
        {/* Profile Picture */}
        <img
          src={user.profilePic || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        
        <div className="ml-4">
          {isEditing ? (
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm mt-1 border border-gray-300 rounded-lg"
            />
          ) : null}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
          First Name
        </label>
        {isEditing ? (
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.firstName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
          Last Name
        </label>
        {isEditing ? (
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.lastName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="dob">
          Date of Birth
        </label>
        {isEditing ? (
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.dob}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        {isEditing ? (
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
          Gender
        </label>
        {isEditing ? (
          <input
            id="gender"
            name="gender"
            type="text"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.gender}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="city">
          City
        </label>
        {isEditing ? (
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.city}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="state">
          State
        </label>
        {isEditing ? (
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.state}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
          Phone Number
        </label>
        {isEditing ? (
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        ) : (
          <p>{user.phone}</p>
        )}
      </div>

      {/* Edit/Save Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;