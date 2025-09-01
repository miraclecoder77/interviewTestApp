
import { NextRequest, NextResponse } from 'next/server';

// Define the user data interface
interface UserData {
  name: string;
  gender: 'male' | 'female';
  email: string;
  status: 'active' | 'inactive';
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const userData: UserData = await request.json();
    
    // Validate required fields
    const { name, gender, email, status } = userData;
    
    if (!name || !gender || !email || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: name, gender, email, status' },
        { status: 400 }
      );
    }

    // Validate gender and status values
    if (!['male', 'female'].includes(gender)) {
      return NextResponse.json(
        { error: 'Gender must be either "male" or "female"' },
        { status: 400 }
      );
    }

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const ACCESS_TOKEN = process.env.EXTERNAL_API_TOKEN
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'API access token not configured' },
        { status: 500 }
      );
    }

    // Send the user data to the external API
    const response = await fetch('https://gorest.co.in/public/v2/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        name,
        gender,
        email,
        status
      })
    });

    // Handle the response
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'Failed to create user',
          details: errorData 
        },
        { status: response.status }
      );
    };

    const newUser = await response.json();
    
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

