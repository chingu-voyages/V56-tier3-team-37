import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { patientService } from '@/lib/patient-service';

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Enhanced system prompt with patient lookup capabilities
const SYSTEM_PROMPT = `You are an AI assistant for Care Flow, a healthcare application that helps reduce stress during surgery by providing real-time updates and workflow transparency.

Your role is to:
- Provide helpful, accurate information about medical procedures and healthcare topics
- Offer emotional support and reassurance to families waiting for surgery updates
- Explain medical terminology in simple, understandable terms
- Help users understand the surgery process and what to expect
- Provide general health and wellness information
- Assist with administrative questions about the healthcare system
- **NEW: Look up patient status and surgery information when requested**

Patient Lookup Capabilities:
- When users ask about a specific patient (by name or ID), you can search the database
- You can provide current surgery status, surgery type, and other relevant information
- Always maintain patient privacy and only share appropriate information
- If multiple patients match a search, ask for more specific information

Important guidelines:
- Always maintain a professional yet warm and reassuring tone
- Never provide medical diagnoses or specific medical advice
- Respect patient privacy - never ask for or share specific patient information unless explicitly requested
- If someone asks for medical advice, direct them to consult with healthcare professionals
- Be culturally sensitive and respectful of diverse backgrounds
- If you're unsure about medical information, recommend consulting a healthcare provider
- Keep responses clear, simple, and free of unnecessary medical jargon
- Focus on education and emotional support rather than medical treatment
- **For patient lookups: Use the provided patient data to give helpful, reassuring updates**

Your responses should be helpful, accurate, and comforting while maintaining appropriate medical ethics and boundaries.`;

// Function to extract patient search queries from user messages
function extractPatientQuery(message: string): { type: 'name' | 'id' | null; query: string | null } {
  const messageLower = message.toLowerCase();
  
  // Check for patient ID patterns (6-character alphanumeric)
  const patientIdMatch = message.match(/\b[A-Z0-9]{6}\b/i);
  if (patientIdMatch) {
    return { type: 'id', query: patientIdMatch[0].toUpperCase() };
  }
  
  // Check for patient name patterns
  const namePatterns = [
    /(?:patient|surgery|status)\s+(?:for|of|about)\s+([a-zA-Z\s]+)/i,
    /(?:how is|what is the status of|check status for)\s+([a-zA-Z\s]+)/i,
    /(?:look up|find|search for)\s+([a-zA-Z\s]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 1) {
        return { type: 'name', query: name };
      }
    }
  }
  
  return { type: null, query: null };
}

// Function to search for patients
async function searchPatientData(searchTerm: string, searchType: 'name' | 'id'): Promise<any> {
  try {
    if (searchType === 'id') {
      // Search by patient ID
      const patients = await patientService.getPatients();
      const patient = patients.find(p => p.patientId === searchTerm);
      return patient ? { found: true, patient, type: 'single' } : { found: false };
    } else {
      // Search by name
      const patients = await patientService.getPatients();
      const matchingPatients = patients.filter(p => {
        const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
        const legacyName = (p.name || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || legacyName.includes(searchLower);
      });
      
      if (matchingPatients.length === 0) {
        return { found: false };
      } else if (matchingPatients.length === 1) {
        return { found: true, patient: matchingPatients[0], type: 'single' };
      } else {
        return { found: true, patients: matchingPatients, type: 'multiple' };
      }
    }
  } catch (error) {
    console.error('Error searching patient data:', error);
    return { found: false, error: 'Database search failed' };
  }
}

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

    // Check if this is a patient lookup request
    const patientQuery = extractPatientQuery(message);
    let patientData = null;
    let enhancedPrompt = SYSTEM_PROMPT;

    if (patientQuery.query && patientQuery.type) {
      // Search for patient data
      patientData = await searchPatientData(patientQuery.query, patientQuery.type);
      
      if (patientData && patientData.found) {
        if (patientData.type === 'single' && patientData.patient) {
          const patient = patientData.patient;
          enhancedPrompt += `\n\nPATIENT DATA FOUND:
Patient Name: ${patient.firstName || patient.name || 'Unknown'} ${patient.lastName || ''}
Patient ID: ${patient.patientId || 'Unknown'}
Current Status: ${patient.status || 'Unknown'}
Surgery Type: ${patient.surgeryType || 'Not specified'}
Surgery Date: ${patient.surgeryDate || 'Not specified'}
Notes: ${patient.notes || 'None'}

Use this information to provide a helpful and reassuring response about the patient's current status.`;
        } else if (patientData.type === 'multiple' && patientData.patients && Array.isArray(patientData.patients)) {
          const patientNames = patientData.patients.map((p: any) => 
            `${p.firstName || p.name || 'Unknown'} ${p.lastName || ''} (ID: ${p.patientId || 'Unknown'})`
          ).join(', ');
          
          enhancedPrompt += `\n\nMULTIPLE PATIENTS FOUND:
${patientNames}

Ask the user to provide more specific information to identify the correct patient.`;
        }
      } else {
        enhancedPrompt += `\n\nNO PATIENT FOUND:
The search for "${patientQuery.query}" did not return any results. Politely inform the user that no patient was found and suggest they check the spelling or provide more information.`;
      }
    }

    // Log the received message (for debugging)
    console.log('Received message:', message);
    if (patientQuery.query) {
      console.log('Patient query detected:', patientQuery);
      console.log('Patient data found:', patientData);
    }

    try {
      // Generate response using Gemini with enhanced context
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${enhancedPrompt}\n\nUser message: ${message}`,
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
        messageId: Date.now().toString(),
        patientQuery: patientQuery.query ? {
          query: patientQuery.query,
          type: patientQuery.type,
          found: patientData?.found || false,
          resultType: patientData?.type || null
        } : null
      });

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Enhanced fallback response
      let fallbackResponse = `I apologize, but I'm having trouble processing your request right now. `;
      
      if (patientQuery.query && patientData?.found) {
        // If we found patient data but AI failed, provide basic info
        if (patientData.type === 'single' && patientData.patient) {
          const patient = patientData.patient;
          fallbackResponse += `However, I did find information about ${patient.firstName || patient.name || 'Unknown'} ${patient.lastName || ''}:\n\n`;
          fallbackResponse += `• Current Status: ${patient.status || 'Unknown'}\n`;
          fallbackResponse += `• Patient ID: ${patient.patientId || 'Unknown'}\n`;
          if (patient.surgeryType) fallbackResponse += `• Surgery Type: ${patient.surgeryType}\n`;
          if (patient.surgeryDate) fallbackResponse += `• Surgery Date: ${patient.surgeryDate}\n`;
        }
      }
      
      fallbackResponse += `\n\nPlease try again in a moment, or feel free to ask a different question about healthcare, surgery procedures, or general medical information.`;
      
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
        patientQuery: patientQuery.query ? {
          query: patientQuery.query,
          type: patientQuery.type,
          found: patientData?.found || false,
          resultType: patientData?.type || null
        } : null
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
    message: 'Chat API is running with Gemini Pro integration and Patient Lookup!',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
