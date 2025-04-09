import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Utils/firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../Context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.emailVerified || user.uid !== userId) {
        alert("Access denied or user not verified.");
        return navigate("/login");
      }

      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
        setFormData(docSnap.data());
      } else {
        console.warn("No user found.");
      }
    };

    if (!loading) {
      fetchUser();
    }
  }, [userId, user, navigate, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      let profilePicUrl = formData.profilePic;

      if (file) {
        if (profileData.profilePic) {
          try {
            const oldRef = ref(storage, profileData.profilePic);
            await deleteObject(oldRef);
          } catch (err) {
            console.warn("Old image deletion failed:", err.message);
          }
        }

        const cleanFileName = file.name.replace(/\s+/g, "-");
        const newRef = ref(storage, `profile_pics/${userId}-${cleanFileName}`);
        const snapshot = await uploadBytes(newRef, file);
        profilePicUrl = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(doc(db, 'users', userId), {
        ...formData,
        profilePic: profilePicUrl,
      });

      setProfileData({ ...formData, profilePic: profilePicUrl });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading || !profileData) return <div className="p-6 text-center text-lg">Loading profile...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="flex items-center mb-4">
        <img
          src={profileData.profilePic || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="ml-4 block w-full text-sm"
          />
        )}
      </div>

      {[
        'firstName', 'lastName', 'dob', 'email',
        'gender', 'city', 'state', 'phone'
      ].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {isEditing ? (
            <input
              id={field}
              name={field}
              type={field === 'dob' ? 'date' : 'text'}
              value={formData[field] || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          ) : (
            <p>{profileData[field]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4 mt-4">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;