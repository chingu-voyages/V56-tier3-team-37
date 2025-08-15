import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { patientService } from '@/lib/patient-service';
import { UserRole, getUserRole } from '@/lib/user-roles';

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Enhanced system prompt with privacy-focused patient lookup capabilities
const SYSTEM_PROMPT = `You are an AI assistant for Care Flow, a healthcare application that helps reduce stress during surgery by providing real-time updates and workflow transparency.

Your role is to:
- Provide helpful, accurate information about medical procedures and healthcare topics
- Offer emotional support and reassurance to families waiting for surgery updates
- Explain medical terminology in simple, understandable terms
- Help users understand the surgery process and what to expect
- Provide general health and wellness information
- Assist with administrative questions about the healthcare system
- **NEW: Look up patient status and surgery information with strict privacy controls**

Patient Lookup Capabilities (PRIVACY-FOCUSED):
- **ADMIN USERS ONLY**: Can search by patient name OR patient code, get direct results
- **ALL OTHER USERS**: Can ONLY search by patient code (6-character alphanumeric)
- Patient codes work like passwords - they provide secure access to patient information
- **ADMIN PRIVILEGE**: Administrators can see patient names in responses for convenience
- **GUEST RESTRICTION**: Guests must provide patient codes upfront to get any information
- Always maintain appropriate privacy based on user role

Privacy Rules:
- For non-admin users: Only accept patient code searches (6-character format like ABC123)
- For admin users: Accept both name and code searches, can show patient names in responses
- For guests: Patient codes required upfront - no name-based searches allowed
- Example: Admin sees "John Smith is currently in recovery", Guest sees "Patient ABC123 is currently in recovery"
- **ROLE-BASED PRIVACY**: Different privacy levels based on user authentication
- This provides convenience for admins while protecting guest privacy

Important guidelines:
- Always maintain a professional yet warm and reassuring tone
- Never provide medical diagnoses or specific medical advice
- Respect patient privacy - this is CRITICAL for healthcare applications
- If someone asks for medical advice, direct them to consult with healthcare professionals
- Be culturally sensitive and respectful of diverse backgrounds
- If you're unsure about medical information, recommend consulting a healthcare provider
- Keep responses clear, simple, and free of unnecessary medical jargon
- Focus on education and emotional support rather than medical treatment
- **For patient lookups: Use role-appropriate privacy levels**
- **Admins**: Can show patient names for convenience
- **Guests**: Always use patient codes, never names

Your responses should be helpful, accurate, and comforting while maintaining appropriate privacy levels based on user role.`;

// Function to extract patient search queries from user messages with role-based restrictions
function extractPatientQuery(message: string, userRole: UserRole): { type: 'name' | 'id' | null; query: string | null; allowed: boolean } {
  const messageLower = message.toLowerCase();
  
  // Check for patient ID patterns first (6-character alphanumeric) - always allowed
  const patientIdMatch = message.match(/\b[A-Z0-9]{6}\b/i);
  if (patientIdMatch) {
    // Double-check that this isn't part of a name
    const beforeMatch = message.substring(0, message.indexOf(patientIdMatch[0]));
    const afterMatch = message.substring(message.indexOf(patientIdMatch[0]) + 6);
    
    // If there are letters before or after, it's likely part of a name
    const hasLettersBefore = /\b[a-zA-Z]+\s*$/.test(beforeMatch);
    const hasLettersAfter = /^\s*[a-zA-Z]+\b/.test(afterMatch);
    
    if (!hasLettersBefore && !hasLettersAfter) {
      return { type: 'id', query: patientIdMatch[0].toUpperCase(), allowed: true };
    }
  }
  
  // Check for patient name patterns - ONLY allowed for ADMIN users
  if (userRole === UserRole.ADMIN) {
    const namePatterns = [
      // Direct name mentions (most common case)
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/,
      // Natural language patterns
      /(?:how is|how's)\s+([a-zA-Z\s]+)\s+(?:doing|feeling|recovering)/i,
      /(?:tell me about|give me info on|info about)\s+([a-zA-Z\s]+)/i,
      /(?:patient|surgery|status)\s+(?:for|of|about)\s+([a-zA-Z\s]+)/i,
      /(?:how is|what is the status of|check status for)\s+([a-zA-Z\s]+)/i,
      /(?:look up|find|search for)\s+([a-zA-Z\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        let name = match[1].trim();
        
        // Clean up the name by removing common prefixes/suffixes
        name = name.replace(/^(patient|surgery|status|check|look|find|search|info|about|for|of|on)\s+/i, '');
        name = name.replace(/\s+(patient|surgery|status|check|look|find|search|info|about|for|of|on)$/i, '');
        
        if (name.length > 1) {
          return { type: 'name', query: name, allowed: true };
        }
      }
    }
  }
  
  // If we get here, no valid search query was found
  return { type: null, query: null, allowed: false };
}

// Function to search for patients with privacy controls
async function searchPatientData(searchTerm: string, searchType: 'name' | 'id', userRole: UserRole): Promise<any> {
  try {
    if (searchType === 'id') {
      // Search by patient ID - always allowed
      const patients = await patientService.getPatients();
      const patient = patients.find(p => p.patientId === searchTerm);
      return patient ? { found: true, patient, type: 'single' } : { found: false };
    } else if (searchType === 'name' && userRole === UserRole.ADMIN) {
      // Search by name - only for admin users
      const patients = await patientService.getPatients();
      const searchLower = searchTerm.toLowerCase().trim();
      
      const matchingPatients = patients.filter(p => {
        // Check multiple name combinations
        const firstName = (p.firstName || '').toLowerCase();
        const lastName = (p.lastName || '').toLowerCase();
        const legacyName = (p.name || '').toLowerCase();
        
        // Full name combinations
        const fullName = `${firstName} ${lastName}`.trim();
        const reverseFullName = `${lastName} ${firstName}`.trim();
        
        // Split search term into words for better matching
        const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
        
        // Check if search term matches any part of the name
        const exactMatches = (
          fullName.includes(searchLower) ||
          reverseFullName.includes(searchLower) ||
          legacyName.includes(searchLower) ||
          firstName.includes(searchLower) ||
          lastName.includes(searchLower)
        );
        
        // Check if individual words match
        const wordMatches = searchWords.some(word => 
          fullName.includes(word) ||
          reverseFullName.includes(word) ||
          legacyName.includes(word) ||
          firstName.includes(word) ||
          lastName.includes(word)
        );
        
        return exactMatches || wordMatches;
      });
      
      if (matchingPatients.length === 0) {
        return { found: false };
      } else if (matchingPatients.length === 1) {
        return { found: true, patient: matchingPatients[0], type: 'single' };
      } else {
        return { found: true, patients: matchingPatients, type: 'multiple' };
      }
    } else {
      // Name search not allowed for non-admin users
      return { found: false, error: 'Name search not allowed for your role' };
    }
  } catch (error) {
    console.error('Error searching patient data:', error);
    return { found: false, error: 'Database search failed' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userRole = UserRole.GUEST } = body;

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

    // Check if this is a patient lookup request with role-based restrictions
    const patientQuery = extractPatientQuery(message, userRole);
    let patientData = null;
    let enhancedPrompt = SYSTEM_PROMPT;

    if (patientQuery.query && patientQuery.type && patientQuery.allowed) {
      // Search for patient data
      patientData = await searchPatientData(patientQuery.query, patientQuery.type, userRole);
      
      if (patientData && patientData.found) {
        if (patientData.type === 'single' && patientData.patient) {
          const patient = patientData.patient;
          // Enhanced prompt with role-based patient information
          enhancedPrompt += `\n\nPATIENT DATA FOUND:
Patient Name: ${patient.firstName || patient.name || 'Unknown'} ${patient.lastName || ''}
Patient Code: ${patient.patientId || 'Unknown'}
Current Status: ${patient.status || 'Unknown'}
Surgery Type: ${patient.surgeryType || 'Not specified'}
Surgery Date: ${patient.surgeryDate || 'Not specified'}
Notes: ${patient.notes || 'None'}

PRIVACY RULES BASED ON USER ROLE:
- **ADMIN USERS**: You can mention the patient's name for convenience
- **GUEST USERS**: Always use "Patient [CODE]" format, never mention names
- Use this information to provide a helpful and reassuring response about the patient's current status
- Adjust privacy level based on user role: ${userRole === UserRole.ADMIN ? 'Admin (can show names)' : 'Guest (code-only)'}`;
        } else if (patientData.type === 'multiple' && patientData.patients && Array.isArray(patientData.patients)) {
          if (userRole === UserRole.ADMIN) {
            const patientNames = patientData.patients.map((p: any) => 
              `${p.firstName || p.name || 'Unknown'} ${p.lastName || ''} (${p.patientId || 'Unknown'})`
            ).join(', ');
            
            enhancedPrompt += `\n\nMULTIPLE PATIENTS FOUND:
${patientNames}

Ask the user to provide more specific information to identify the correct patient.`;
          } else {
            const patientCodes = patientData.patients.map((p: any) => 
              `Patient ${p.patientId || 'Unknown'}`
            ).join(', ');
            
            enhancedPrompt += `\n\nMULTIPLE PATIENTS FOUND:
${patientCodes}

Ask the user to provide the specific patient code to identify the correct patient.`;
          }
        }
      } else {
        if (patientData?.error === 'Name search not allowed for your role') {
          enhancedPrompt += `\n\nSEARCH RESTRICTION:
The user attempted to search by name, but this feature is only available to administrators for privacy reasons.

Inform the user that:
- For privacy and security, patient searches by name are restricted to administrators
- They can search using their patient code (6-character format like ABC123)
- Patient codes work like passwords and provide secure access to their information
- This protects patient privacy and prevents unauthorized access to medical records`;
        } else {
          enhancedPrompt += `\n\nNO PATIENT FOUND:
The search for "${patientQuery.query}" did not return any results. 

If searching by patient code:
- Politely inform the user that no patient was found with that code
- Suggest they check the code spelling or contact hospital staff
- Remind them that patient codes are 6-character alphanumeric (e.g., ABC123)

If searching by name (admin only):
- Politely inform the user that no patient was found with that name
- Suggest they check the spelling or provide more specific information`;
        }
      }
    } else if (patientQuery.query && !patientQuery.allowed) {
      // Search attempted but not allowed for this role
      enhancedPrompt += `\n\nSEARCH RESTRICTION DETECTED:
The user attempted to search by name, but this feature is restricted to administrators for privacy reasons.

Inform the user that:
- For privacy and security, patient searches by name are restricted to administrators
- They can search using their patient code (6-character format like ABC123)
- Patient codes work like passwords and provide secure access to their information
- This protects patient privacy and prevents unauthorized access to medical records
- If they need to search by name, they should contact an administrator`;
    }

    // Log the received message (for debugging)
    console.log('Received message:', message);
    console.log('User role:', userRole);
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
          resultType: patientData?.type || null,
          allowed: patientQuery.allowed
        } : null
      });

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Enhanced fallback response with privacy focus
      let fallbackResponse = `I apologize, but I'm having trouble processing your request right now. `;
      
      if (patientQuery.query && patientData?.found) {
        // If we found patient data but AI failed, provide basic info with role-based privacy
        if (patientData.type === 'single' && patientData.patient) {
          const patient = patientData.patient;
          if (userRole === UserRole.ADMIN) {
            fallbackResponse += `However, I did find information about ${patient.firstName || patient.name || 'Unknown'} ${patient.lastName || ''}:\n\n`;
          } else {
            fallbackResponse += `However, I did find information about Patient ${patient.patientId || 'Unknown'}:\n\n`;
          }
          fallbackResponse += `• Current Status: ${patient.status || 'Unknown'}\n`;
          if (userRole === UserRole.ADMIN) {
            fallbackResponse += `• Patient Name: ${patient.firstName || patient.name || 'Unknown'} ${patient.lastName || ''}\n`;
          }
          fallbackResponse += `• Patient Code: ${patient.patientId || 'Unknown'}\n`;
          if (patient.surgeryType) fallbackResponse += `• Surgery Type: ${patient.surgeryType}\n`;
          if (patient.surgeryDate) fallbackResponse += `• Surgery Date: ${patient.surgeryDate}\n`;
        }
      } else if (patientQuery.query && !patientQuery.allowed) {
        fallbackResponse += `\n\nFor privacy and security, patient searches by name are restricted to administrators. You can search using your patient code (6-character format like ABC123).`;
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
          resultType: patientData?.type || null,
          allowed: patientQuery.allowed
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
    message: 'Chat API is running with Gemini Pro integration and Enhanced Privacy Controls!',
    timestamp: new Date().toISOString(),
    status: 'active',
    features: [
      'Role-based patient search access',
      'Admin: Name or code search',
      'Guests: Code-only search',
      'Patient privacy protection',
      'Patient code-based responses'
    ]
  });
}
