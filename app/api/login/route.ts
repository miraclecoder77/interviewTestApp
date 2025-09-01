
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Define the login data interface
interface LoginData {
  email: string;
}

interface apiExternalUser {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const loginData: LoginData = await request.json();
    
    // Validate required fields
    const { email } = loginData;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // api access token
    const ACCESS_TOKEN = process.env.EXTERNAL_API_TOKEN;
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'API access token not configured' },
        { status: 500 }
      );
    }

    // Search for user by email in api
    const response = await fetch(`https://gorest.co.in/public/v2/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to authenticate with external API' },
        { status: response.status }
      );
    }

    const users: apiExternalUser[] = await response.json();
    
    // Check if user exists
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found. Please check your email or register first.' },
        { status: 404 }
      );
    }

    // Get the first user (should be unique by email)
    const user = users[0];

    // Check if user account is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate JWT token for session management
    const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Create user session data (exclude sensitive info)
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status
    };

    // Return success response with token and user data
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: userSession
      },
      { 
        status: 200,
        headers: {
          // Set HTTP-only cookie with the token (optional)
          'Set-Cookie': `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
        }
      }
    );

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
