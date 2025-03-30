import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Utils/firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const checkAccess = () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.emailVerified) {
        alert('You must verify your email before accessing your profile.');
        navigate('/login');
      }
    };

    const fetchUser = async () => {
      checkAccess();
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setFormData(docSnap.data());
      }
    };

    fetchUser();
  }, [userId, auth, navigate]);

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
        if (user.profilePic) {
          const storageRef = ref(storage, user.profilePic);
          await deleteObject(storageRef);
        }

        const storageRef = ref(storage, `profile_pics/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        profilePicUrl = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(doc(db, 'users', userId), {
        ...formData,
        profilePic: profilePicUrl,
      });

      setUser({ ...formData, profilePic: profilePicUrl });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="flex items-center mb-4">
        <img
          src={user.profilePic || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        {isEditing && (
          <input type="file" onChange={handleFileChange} className="ml-4 block w-full text-sm" />
        )}
      </div>

      {[
        'firstName',
        'lastName',
        'dob',
        'email',
        'gender',
        'city',
        'state',
        'phone',
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
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          ) : (
            <p>{user[field]}</p>
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