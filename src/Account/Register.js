import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../server/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    gender: '',
    city: '',
    state: '',
    phone: '',
    profilePic: null, // Store file reference here
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0], // Store the file reference when it changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, gender, city, state, phone, dob, profilePic } = formData;

    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload profile picture to Firebase Storage
      let profilePicUrl = '';
      if (profilePic) {
        const storageRef = ref(storage, `profile_pics/${profilePic.name}`);
        const snapshot = await uploadBytes(storageRef, profilePic);
        profilePicUrl = await getDownloadURL(snapshot.ref()); // Get the download URL for the uploaded image
      }

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        phone,
        dob,
        profilePic: profilePicUrl, // Store the URL of the uploaded profile pic
      });

      // Redirect to the user's profile page after successful registration
      navigate(`/profile/${user.uid}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="gender">Gender</label>
          <input
            id="gender"
            name="gender"
            type="text"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4">Register</button>
      </form>
    </div>
  );
};

export default Register;