import React, { useState } from 'react';
import Navbar from "../components/navbar"
import axios from 'axios';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store JWT token
      router.push('/dashboard'); // Redirect after login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
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
            <div className="mb-6">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
