import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Log the received message (for debugging)
    console.log('Received message:', message);

    // TODO: Here you can integrate with Gemini API
    // For now, we'll return a simple response
    const response = `I received your message: "${message}". This is a placeholder response. In the future, this will be connected to Gemini AI!`;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Chat API is running!',
    timestamp: new Date().toISOString()
  });
}
