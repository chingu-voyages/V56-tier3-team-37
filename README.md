# Surgery Status App - Chingu Voyage Project

A comprehensive Next.js skeleton app demonstrating modern web development practices including BEM methodology, SCSS preprocessing, Firebase authentication, and daisyUI components. Built for Chingu Voyage learning experience.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Firebase** (optional for demo mode)
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Copy your config to `.env.local`

3. **Run the app**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
V56-tier3-team-37/
├── .gitignore                 # Git ignore rules
├── .env.local.example         # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS + daisyUI configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
├── README.md                  # This file
├── SETUP.md                   # Detailed setup guide
└── src/
    ├── app/                   # Next.js App Router pages
    │   ├── layout.tsx         # Root layout with AuthProvider
    │   ├── page.tsx           # Home page (/)
    │   ├── globals.scss       # BEM + SCSS styles
    │   ├── auth/
    │   │   └── page.tsx       # Authentication page (/auth)
    │   ├── patients/
    │   │   └── page.tsx       # Patient list page (/patients)
    │   ├── add-patient/
    │   │   └── page.tsx       # Add patient form (/add-patient)
    │   └── chatbot-demo/
    │       └── page.tsx       # Chatbot privacy demo page (/chatbot-demo)
    ├── components/            # Reusable UI components
    │   ├── Header.tsx         # Navigation header (BEM)
    │   ├── MobileHeader.tsx   # Mobile navigation with animated hamburger
    │   ├── Footer.tsx         # Footer component (BEM)
    │   ├── SurgeryTypeAutocomplete.tsx # Standardized surgery types autocomplete
    │   └── BrandButton.tsx    # Custom branded button component
    └── lib/                   # Utility libraries
        ├── firebase.ts        # Firebase configuration (commented)
        ├── auth-context.tsx   # Authentication context (mock)
        ├── surgery-types.ts   # Standardized surgery types and utilities
        └── patient-service.ts # Patient data management service
```

## 🔒 Enhanced AI Chatbot with Privacy Controls

### Overview
The Care Flow AI chatbot now features advanced privacy controls and role-based access management to protect patient information while maintaining helpful functionality.

### Privacy Features
- **Role-Based Access Control**: Different search capabilities based on user roles
- **Patient Code Protection**: Patient codes work like passwords for secure access
- **Name Search Restrictions**: Only administrators can search by patient names
- **Anonymous Responses**: AI never reveals patient names, only patient codes
- **Secure Communication**: All patient information is shared using code references
- **Personalized Experience**: Role-based greetings for enhanced user experience
- **Status Page Integration**: Patient codes displayed for admin/surgical team users

### User Role Capabilities

#### 🔑 Administrators
- ✅ Can search patients by name OR patient code
- ✅ Full access to patient lookup features
- ✅ Can see patient names in responses for convenience
- 🔓 Administrative privileges for efficient workflow
- 👋 Personalized greeting: "Hello Admin!"

#### 👥 Surgical Team
- ❌ Cannot search patients by name
- ✅ Can search patients by code only
- 🔒 Limited access: names and codes only (no surgery details)
- 🔄 Can update patient status
- 👋 Personalized greeting: "Hello Surgical Team!"

#### 👤 Guests
- ❌ Cannot search patients by name
- ✅ Can search patients by code only
- 🔒 Restricted access for privacy
- 🔐 Patient codes work like passwords
- 👋 Standard greeting: "Hello! I'm your AI assistant..."

### How It Works
1. **Patient Code System**: Each patient gets a unique 6-character alphanumeric code (e.g., ABC123)
2. **Privacy-First Responses**: AI responds with "Patient ABC123 is in recovery" instead of "John Smith is in recovery"
3. **Role Enforcement**: System automatically restricts search capabilities based on user authentication
4. **Secure Access**: Only those with the patient code can access information

### Example Scenarios
- **Admin**: "How is John Smith?" → Searches by name, responds with "John Smith is currently in recovery"
- **Guest**: "How is John Smith?" → Blocked, explains code-only requirement
- **Any User**: "Check ABC123" → Searches by code, responds with "Patient ABC123 is..." (guests) or "John Smith is currently in recovery" (admins)

### Personalized Greetings
- **Administrator**: "Hello Admin! I'm your AI assistant..."
- **Surgical Team**: "Hello Surgical Team! I'm your AI assistant..."
- **Guest**: "Hello! I'm your AI assistant..." (standard greeting)

### Demo Page
Visit `/chatbot-demo` to test the enhanced privacy features in real-time with different user roles.

### Patient Status Page
Visit `/status` to see role-based patient information display:
- **Administrators**: See patient names, codes, surgery details, and helpful chatbot integration tips
- **Surgical Team**: See patient names and codes only (for status updates)
- **Guests**: See only patient codes and status for privacy protection

---

## 🏥 Standardized Surgery Types

### Overview
This application implements a comprehensive standardized surgery types system to ensure data consistency, eliminate errors, and improve patient safety.

### Features
- **60+ Standardized Procedures**: Comprehensive coverage across all major surgical specialties
- **Smart Icon System**: Category-level icons with subtle procedure indicators for clean UX
- **Autocomplete Functionality**: Real-time search with category grouping and descriptions
- **Category Organization**: Logical grouping by medical specialty (Cardiac, Neurosurgery, Orthopedics, etc.)
- **Common Aliases**: Includes alternative names and abbreviations for each procedure
- **Validation**: Ensures only valid surgery types are entered into the system

### Available Categories
- **🫀 Cardiac & Cardiovascular**: CABG, Heart Valve Replacement, Angioplasty, Pacemaker Implantation
- **🧠 Neurosurgery**: Craniotomy, Spinal Fusion, Laminectomy, Deep Brain Stimulation
- **👁️ Ophthalmology**: Cataract Extraction, LASIK, Retinal Detachment Repair, Glaucoma Surgery
- **🩺 General Surgery**: Appendectomy, Hernia Repair, Cholecystectomy, Gastrectomy, Colectomy
- **🦴 Orthopedic Surgery**: Hip/Knee Replacement, Arthroscopy, Shoulder Surgery, Ankle Fusion
- **🫁 Thoracic Surgery**: Lobectomy, Pneumonectomy, Mediastinoscopy, Esophagectomy
- **🧍‍♂️ Urology**: Prostatectomy, Nephrectomy, Cystectomy, Ureteroscopy
- **🫄 Obstetrics & Gynecology**: C-Section, Hysterectomy, Tubal Ligation, Myomectomy
- **🧵 Plastic & Reconstructive**: Breast Reconstruction, Skin Grafts, Rhinoplasty, Blepharoplasty
- **🩸 Vascular Surgery**: Carotid Endarterectomy, Peripheral Bypass, Varicose Vein Surgery
- **👂 ENT Surgery**: Tonsillectomy, Adenoidectomy, Tympanoplasty, Septoplasty
- **👶 Pediatric Surgery**: Circumcision, Inguinal Hernia Repair, Pyloromyotomy
- **🔄 Transplant Surgery**: Kidney, Liver, Heart, and Lung Transplants
- **🚨 Emergency Surgery**: Exploratory Laparotomy, Thoracotomy, Emergency Craniotomy

### Implementation
The autocomplete component is integrated into:
- Edit Patient forms (`/edit-patient/[id]`)
- Inline editing in Patients list (`/patients`)
- Demo page (`/surgery-types-demo`)

### Benefits
✅ **Eliminates Errors**: No more typos or misspellings in medical terms  
✅ **Ensures Consistency**: Standardized terminology across the organization  
✅ **Improves Data Quality**: Better reporting and analytics capabilities  
✅ **Saves Time**: Reduces manual typing with intelligent search  
✅ **Enhances Safety**: Clear, unambiguous procedure names  
✅ **Clean UX Design**: Category-level icons prevent visual clutter  
✅ **Professional Appearance**: Medical-grade interface following UX best practices  
✅ **Sophisticated Animations**: Intelligent robot animations for engagement  

## 🎨 Material UI Theme & BEM Methodology

### Material UI Theme Configuration

This project includes a comprehensive Material UI theme using a custom teal color palette:

#### **Teal Color Palette**
```typescript
const tealPalette = {
  teal: '#07BEB8',           // Primary teal
  mediumTeal: '#3DCCC7',     // Medium teal
  lightAqua: '#68d8D6',      // Light aqua
  lightBlue: '#9CEAEF',      // Light blue
  veryLightAqua: '#C4FFF9',  // Very light aqua
  black: '#000000',          // Black
};
```

#### **Theme Features**
- **Custom Color Palette**: Teal-based theme with complementary colors
- **Typography**: Roboto font integration with proper font weights
- **Component Customization**: Buttons, cards, forms, and more styled with teal theme
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: High contrast ratios and proper color usage

#### **Theme Demo**
Visit `/theme-demo` to see all Material UI components styled with the custom theme.

#### **Using Material UI Components**
```tsx
import { Button, Card, Typography } from '@mui/material';

// Components automatically use the teal theme
<Button variant="contained">Primary Button</Button>
<Card>Styled Card</Card>
<Typography variant="h4">Styled Typography</Typography>
```

### BEM Methodology & SCSS Implementation

This project demonstrates **BEM (Block Element Modifier)** methodology combined with **SCSS preprocessing** for maintainable and scalable CSS architecture.

### BEM Structure

```
.block {}                    // Main component
.block__element {}           // Child element
.block__element--modifier {} // Element variant
.block--modifier {}          // Component variant
```

### SCSS Architecture

#### **Variables & Mixins**
```scss
// Colors
$color-primary: #3b82f6;
$color-secondary: #64748b;

// Spacing
$spacing-md: 1rem;
$spacing-lg: 1.5rem;

// Mixins
@mixin respond-to($breakpoint) {
  @media (min-width: $breakpoint) { @content; }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### **Component Examples**

**Header Component:**
```scss
.header {
  background: var(--color-primary);
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  &__navbar {
    display: flex;
    align-items: center;
  }
  
  &__nav-item {
    color: white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
```

**Form Components:**
```scss
.form {
  &__group {
    margin-bottom: $spacing-lg;
  }
  
  &__input {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 1px solid #d1d5db;
    
    &:focus {
      border-color: var(--color-primary);
    }
    
    &--error {
      border-color: var(--color-error);
    }
  }
  
  &__button {
    &--primary {
      background: var(--color-primary);
    }
    
    &--loading {
      position: relative;
      color: transparent;
      
      &::after {
        content: '';
        animation: spin 1s linear infinite;
      }
    }
  }
}
```

### Key SCSS Features Used

- **Variables**: Colors, spacing, typography, breakpoints
- **Mixins**: Responsive design, flexbox utilities, shadows
- **Nesting**: BEM structure with SCSS nesting
- **Extends**: Shared styles between components
- **Functions**: Color manipulation (darken, rgba)
- **Media Queries**: Responsive breakpoints
- **Animations**: Loading spinners and transitions

## 📱 Mobile Header Component

The project includes a dedicated `MobileHeader` component that provides an enhanced mobile navigation experience with smooth animations and modern UI patterns.

### Features

- **Animated Hamburger Menu**: Smooth 3-line to X transformation animation
- **Circular Reveal Effect**: Menu opens with a circular clip-path animation from the hamburger button
- **Role-Based Navigation**: Dynamic menu items based on user authentication and role
- **Smooth Animations**: Staggered entrance animations for menu items using Framer Motion
- **Responsive Design**: Automatically hidden on desktop (md: breakpoint and above)

### Animation Details

#### Hamburger Animation
```tsx
const burgerVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const lineVariants = {
  closed: { rotate: 0, y: 0 },
  open: (i: number) => ({
    rotate: i === 0 ? 45 : i === 1 ? -45 : 0,
    y: i === 0 ? 6 : i === 1 ? -6 : 0,
    opacity: i === 2 ? 0 : 1,
  }),
};
```

#### Circular Reveal Effect
The mobile menu uses CSS `clip-path` with `ellipse()` to create a circular expansion animation:
```tsx
initial={{ clipPath: `ellipse(0px 0px at ${origin.x}px ${origin.y}px)` }}
animate={{ clipPath: `ellipse(100vw 100vh at ${origin.x}px ${origin.y}px)` }}
```

### Usage

The `MobileHeader` is automatically included in the root layout and works alongside the desktop `Header`:

```tsx
// In layout.tsx
<Header />        // Desktop header (hidden on mobile)
<MobileHeader />  // Mobile header (hidden on desktop)
```

### Navigation Items

The mobile menu dynamically shows navigation items based on user authentication and role:

- **Unauthenticated**: Login link, Care Flow, Patient Status
- **Surgical Team**: All above + Update Patient Status
- **Administrator**: All above + Patient Information (Add/Edit patients)

### Styling

- Uses the same teal color scheme (`#07BEB8`) as the desktop header
- Material-UI icons for consistent visual language
- Tailwind CSS for responsive utilities and animations
- Framer Motion for smooth, performant animations

## 🛠️ Dependencies

### Core Dependencies
```json
{
  "next": "15.4.1",           // React framework with App Router
  "react": "19.1.0",          // React library
  "react-dom": "19.1.0",      // React DOM rendering
  "typescript": "^5"          // Type safety
}
```

### Styling & Preprocessing
```json
{
  "tailwindcss": "^4",        // Utility-first CSS framework
  "daisyui": "latest",        // Component library for Tailwind
  "sass": "latest",           // SCSS preprocessor
  "@mui/material": "^7.2.0",  // Material UI component library
  "@mui/icons-material": "^7.2.0", // Material UI icons
  "@emotion/react": "^11.14.0", // Emotion for Material UI styling
  "@emotion/styled": "^11.14.1"  // Styled components for Material UI
}
```

### Authentication & Database
```json
{
  "firebase": "^11.10.0",           // Firebase SDK
  "react-firebase-hooks": "^5.1.1", // Firebase React hooks
  "@fontsource/roboto": "^5.2.6"    // Roboto font for Material UI
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",       // Node.js TypeScript types
  "@types/react": "^19",      // React TypeScript types
  "@types/react-dom": "^19",  // React DOM TypeScript types
  "eslint": "^9",             // Code linting
  "eslint-config-next": "15.4.1"  // Next.js ESLint config
}
```

## 🗂️ App Routing Explanation

This project uses **Next.js App Router** (introduced in Next.js 13+), which provides file-system based routing.

### How App Router Works

1. **File-based Routing**: Each folder in `src/app/` represents a route segment
2. **Page Files**: `page.tsx` files define the UI for each route
3. **Layout Files**: `layout.tsx` files wrap pages with shared UI
4. **Nested Routes**: Folders can contain other folders for nested routes

### Route Structure

```
src/app/
├── layout.tsx                 # Root layout (applies to all routes)
├── page.tsx                   # Home page (/)
├── auth/
│   └── page.tsx              # /auth
├── patients/
│   └── page.tsx              # /patients
├── add-patient/
│   └── page.tsx              # /add-patient
├── edit-patient/
│   └── [id]/
│     ├── page.tsx            # /edit-patient/[id]
│     └── EditPatientClient.tsx # Edit patient form component
└── surgery-types-demo/
    └── page.tsx              # /surgery-types-demo
```

### Key Routing Concepts

#### 1. **Root Layout** (`src/app/layout.tsx`)
- Wraps all pages with common UI (Header, Footer, AuthProvider)
- Defines metadata and global styles
- Provides authentication context to all child pages

#### 2. **Home Page** (`src/app/page.tsx`)
- Route: `/`
- Public page (no authentication required)
- Landing page with app overview and navigation

#### 3. **Authentication Page** (`src/app/auth/page.tsx`)
- Route: `/auth`
- Public page for login/signup
- Uses Firebase Authentication (when enabled)

#### 4. **Protected Pages**
- **Patients Page** (`src/app/patients/page.tsx`): Route `/patients`
- **Add Patient Page** (`src/app/add-patient/page.tsx`): Route `/add-patient`
- Both require authentication (redirect to `/auth` if not logged in)

### Navigation Flow

```
User visits / → Home page (public)
├── Clicks "Login" → /auth (public)
│   ├── Success → Redirect to /patients (protected)
│   └── Failure → Stay on /auth with error
├── Clicks "View Patients" → /patients (protected)
│   ├── Authenticated → Show patient list
│   └── Not authenticated → Redirect to /auth
└── Clicks "Add Patient" → /add-patient (protected)
    ├── Authenticated → Show form
    └── Not authenticated → Redirect to /auth
```

## 🔐 Firebase Integration

### Firebase Configuration
- **Firebase Setup**: `src/lib/firebase.ts` - Complete Firebase initialization with your credentials
- **Authentication**: `src/lib/auth-context.tsx` - Real Firebase authentication with error handling
- **Database**: `src/lib/patient-service.ts` - Firestore operations for patient data
- **Provider**: Wraps entire app in `layout.tsx`

### Firebase Services Enabled
- ✅ **Authentication**: Email/password sign-in and sign-up
- ✅ **Firestore Database**: Patient data storage and retrieval
- ✅ **Analytics**: Usage tracking (browser-only)
- ✅ **Error Handling**: Comprehensive error messages for users

### Authentication Flow
1. **Loading**: Shows spinner while checking auth state
2. **Authenticated**: User can access protected routes and manage patients
3. **Unauthenticated**: Redirected to `/auth` page with proper error handling

### Database Operations
```typescript
// Patient service examples
import { patientService } from '@/lib/patient-service';

// Add a new patient
await patientService.addPatient(patientData);

// Get all patients
const patients = await patientService.getPatients();

// Get patients by status
const checkedInPatients = await patientService.getPatientsByStatus('checked-in');

// Update patient
await patientService.updatePatient(id, updates);

// Delete patient
await patientService.deletePatient(id);
```

### Protected Route Pattern
```typescript
const { user, loading } = useAuth();

useEffect(() => {
  if (!loading && !user) {
    router.push('/auth');
  }
}, [user, loading, router]);
```

## 🎯 Key Learning Points

### Next.js App Router
- File-system based routing
- Layout composition
- Server and client components
- Route protection patterns

### BEM Methodology
- Block Element Modifier structure
- Maintainable CSS architecture
- Component-based styling
- Scalable naming conventions

### SCSS Preprocessing
- Variables and mixins
- Nested selectors
- Functions and operations
- Responsive design patterns

### Firebase Authentication
- User state management
- Protected routes
- Authentication context
- Error handling

### React Patterns
- Custom hooks
- Context providers
- Controlled forms
- State management

### UI Development
- daisyUI components
- Tailwind CSS utilities
- Responsive design
- Form validation

### Patient Status Workflow
- **Checked In**: Default status when patient information is recorded
- **Pre-Procedure**: Patient is prepared for surgery
- **In Progress**: Surgery is currently being performed
- **Closing**: Surgery is being completed
- **Recovery**: Patient is in post-operative recovery
- **Complete**: Surgery and recovery are finished
- **Dismissal**: Patient is discharged from care

## 📱 Pages Overview

### 1. **Home Page** (`/`)
- **Purpose**: App overview and navigation guide
- **Features**: Hero section, feature cards, quick start guide
- **Access**: Public (no authentication required)
- **BEM Classes**: `.hero`, `.card`, `.form__button`

### 2. **Authentication Page** (`/auth`)
- **Purpose**: User login and signup
- **Features**: Toggle between login/signup, form validation, error handling
- **Access**: Public
- **BEM Classes**: `.form`, `.alert`, `.card--form`

### 3. **Patients Page** (`/patients`)
- **Purpose**: Display patient list
- **Features**: Table view, demo data, add patient button
- **Access**: Protected (requires authentication)
- **BEM Classes**: `.table`, `.badge`, `.alert`

### 4. **Add Patient Page** (`/add-patient`)
- **Purpose**: Add new patient form
- **Features**: Form validation, controlled inputs, success messages
- **Access**: Protected (requires authentication)
- **BEM Classes**: `.form`, `.grid`, `.card--form`

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📝 Environment Variables

Create `.env.local` in the root directory with your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBoN20mks1zHWbPeh9k6reAXSmejwmKQ78
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=careflow-72c2a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=careflow-72c2a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=careflow-72c2a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960916398964
NEXT_PUBLIC_FIREBASE_APP_ID=1:960916398964:web:f66b89c0574b1bbf214221
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Z4DTS7J9JJ
```

### Environment Variable Setup

1. **Create `.env.local` file** in the project root
2. **Copy the configuration above** into the file
3. **Restart your development server** after creating the file
4. **Never commit `.env.local`** to version control (it's already in `.gitignore`)

### Security Notes

- ✅ **Environment variables are secure** - they're not exposed in client-side code
- ✅ **`.env.local` is gitignored** - your secrets won't be committed
- ✅ **Validation included** - app will show clear error if variables are missing
- ⚠️ **Keep your Firebase keys private** - don't share them publicly

## 🚀 Deployment

This app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Node.js

## 📖 Additional Resources

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [daisyUI Documentation](https://daisyui.com/)
- [BEM Methodology](http://getbem.com/)
- [SCSS Documentation](https://sass-lang.com/)

## 👥 Chingu Voyage Team

This project was built as part of Chingu Voyage, a collaborative learning experience.

### Team Members
- **Cristian Torres** - [GitHub](https://github.com/cristiantorresf19191919)
- **Ruth Igwe-Oruta** - [GitHub](https://github.com/Xondacc) / [LinkedIn](https://www.linkedin.com/in/ruthigwe-oruta)
- **Jessica Hackett** - [GitHub](https://github.com/mooglemoxie0018) / [LinkedIn](https://www.linkedin.com/in/jessica-hackett/)
- **Vincent Bui** - [GitHub](https://github.com/VincentBui0) / [LinkedIn](https://www.linkedin.com/in/vincent-bui0/)
- **Dorene St.Marthe** - [GitHub](https://github.com/Dorene-StMarthe) / [LinkedIn](https://www.linkedin.com/in/dorenestmarthe/)


### Project Goals
- Demonstrate modern React/Next.js development practices
- Implement BEM methodology with SCSS preprocessing
- Show Firebase authentication integration
- Create a scalable and maintainable codebase
- Provide learning resources for fellow developers


