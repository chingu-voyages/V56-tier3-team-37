import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Healthcare-focused system prompt
const SYSTEM_PROMPT = `You are an AI assistant for Care Flow, a healthcare application that helps reduce stress during surgery by providing real-time updates and workflow transparency.

Your role is to:
- Provide helpful, accurate information about medical procedures and healthcare topics
- Offer emotional support and reassurance to families waiting for surgery updates
- Explain medical terminology in simple, understandable terms
- Help users understand the surgery process and what to expect
- Provide general health and wellness information
- Assist with administrative questions about the healthcare system

Important guidelines:
- Always maintain a professional yet warm and reassuring tone
- Never provide medical diagnoses or specific medical advice
- Respect patient privacy - never ask for or share specific patient information
- If someone asks for medical advice, direct them to consult with healthcare professionals
- Be culturally sensitive and respectful of diverse backgrounds
- If you're unsure about medical information, recommend consulting a healthcare provider
- Keep responses clear, simple, and free of unnecessary medical jargon
- Focus on education and emotional support rather than medical treatment

Your responses should be helpful, accurate, and comforting while maintaining appropriate medical ethics and boundaries.`;

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

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Log the received message (for debugging)
    console.log('Received message:', message);

    try {
      // Generate response using Gemini
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${SYSTEM_PROMPT}\n\nUser message: ${message}`,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
        },
      });

      const aiResponse = result.text;

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString()
      });

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Fallback response if Gemini fails
      const fallbackResponse = `I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to ask a different question about healthcare, surgery procedures, or general medical information.`;
      
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString()
      });
    }

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
    message: 'Chat API is running with Gemini Pro integration!',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
