'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-600">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg ">
              <h2 className="text-xl font-semibold mb-4 text-gray-600">User Information</h2>
              <p className='text-gray-600'><strong >Name:</strong> {user.name}</p>
              <p className='text-gray-600'><strong >Email:</strong> {user.email}</p>
              <p className='text-gray-600'><strong >Gender:</strong> {user.gender}</p>
              <p className='text-gray-600'><strong >Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </p>
              <p className='text-gray-600'><strong className='text-gray-600'>User ID:</strong> {user.id}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl text-gray-600 font-semibold mb-4">Welcome Back!</h2>
              <p className="text-gray-600">
                You have successfully logged in to your dashboard. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}