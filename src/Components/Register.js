import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db, storage } from '../Utils/firebase';
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
    profilePic: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password, profilePic, ...profileData } = formData;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      let profilePicUrl = '';
      if (profilePic) {
        const storageRef = ref(storage, `profile_pics/${profilePic.name}`);
        const snapshot = await uploadBytes(storageRef, profilePic);
        profilePicUrl = await getDownloadURL(snapshot.ref);
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        email,
        profilePic: profilePicUrl,
      });

      setSuccess('Registration successful! Please check your email to verify your account.');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        {[
          { label: 'First Name', id: 'firstName' },
          { label: 'Last Name', id: 'lastName' },
          { label: 'Date of Birth', id: 'dob', type: 'date' },
          { label: 'Email', id: 'email', type: 'email' },
          { label: 'Password', id: 'password', type: 'password' },
          { label: 'Gender', id: 'gender' },
          { label: 'City', id: 'city' },
          { label: 'State', id: 'state' },
          { label: 'Phone Number', id: 'phone' },
        ].map(({ label, id, type = 'text' }) => (
          <div className="mb-4" key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              id={id}
              name={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;