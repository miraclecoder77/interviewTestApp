'use client';
import React, {  useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";


interface UserFormData {
  name: string;
  gender: 'male' | 'female';
  email: string;
  status: 'active' | 'inactive';
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    gender: 'male',
    email: '',
    status: 'active'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `User created successfully! ID: ${result.user.id}` });
        // Reset form
        setFormData({
          name: '',
          gender: 'male',
          email: '',
          status: 'active'
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create user' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
    
      // If login is successful, redirect to the dashboard
      router.push('/dashboard');
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center  bg-gray-50 '>
      <div className="max-w-md w-full shadow-lg py-8 px-6 rounded-lg bg-white ">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Register New User</h2>
      
          <div className="space-y-4 ">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border t border-gray-300 rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border t border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter email address"
              />
            </div>

            {/* Gender Select */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* register Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.email}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition-all duration-200 ${
                isLoading || !formData.name || !formData.email
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              } text-white focus:outline-none`}
            >
              {isLoading ? 'Creating User...' : 'Register User'}
            </button>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}
      </div>
      <div className="text-center">
            <p className="text-sm text-gray-600 pt-3">
              Already a User?{' '}
              <Link
              href='/login'
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Login
              </Link>
            </p>
        </div>
    </main>
  );
}