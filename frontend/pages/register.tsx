import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false); // To track OTP sent state
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setOtpSent(true); // OTP sent, show OTP field
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      router.push('/login'); // Redirect after successful registration
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Email and OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* User Registration */}
          {otpSent && otp && (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
