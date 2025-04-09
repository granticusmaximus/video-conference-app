import { Link } from "react-router-dom";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded shadow-lg p-6 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">📩 Check Your Email</h1>
        <p className="text-gray-700 mb-4">
          We've sent a verification link to your email address. Please check your inbox and verify your email before logging in.
        </p>
        <p className="text-sm text-gray-500">
          Once verified, you can{' '}
          <Link to="/login" className="text-blue-500 underline hover:text-blue-700">
            log in here
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;