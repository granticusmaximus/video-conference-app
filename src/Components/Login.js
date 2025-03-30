import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      navigate(`/profile/${user.uid}`);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!formData.email) {
        setError('Please enter your email address first.');
        return;
      }
      await sendPasswordResetEmail(getAuth(), formData.email);
      setInfo('Password reset email sent.');
    } catch (err) {
      setError('Unable to send reset email. Check address and try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && <p className="text-red-500">{error}</p>}
        {info && <p className="text-green-600">{info}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4">
          Log In
        </button>

        <div className="mt-2 text-sm text-center">
          <button type="button" onClick={handlePasswordReset} className="text-blue-500 hover:underline">
            Forgot your password?
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;