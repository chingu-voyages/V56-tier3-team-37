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
    │   └── add-patient/
    │       └── page.tsx       # Add patient form (/add-patient)
    ├── components/            # Reusable UI components
    │   ├── Header.tsx         # Navigation header (BEM)
    │   └── Footer.tsx         # Footer component (BEM)
    └── lib/                   # Utility libraries
        ├── firebase.ts        # Firebase configuration (commented)
        └── auth-context.tsx   # Authentication context (mock)
```

## 🎨 BEM Methodology & SCSS Implementation

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
  "sass": "latest"            // SCSS preprocessor
}
```

### Authentication & Database
```json
{
  "firebase": "^11.10.0",           // Firebase SDK
  "react-firebase-hooks": "^5.1.1"  // Firebase React hooks
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
└── add-patient/
    └── page.tsx              # /add-patient
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

## 🔐 Authentication Flow

### Firebase Integration
- **Configuration**: `src/lib/firebase.ts` - Firebase app initialization
- **Context**: `src/lib/auth-context.tsx` - React context for user state
- **Provider**: Wraps entire app in `layout.tsx`

### Authentication States
1. **Loading**: Shows spinner while checking auth state
2. **Authenticated**: User can access protected routes
3. **Unauthenticated**: Redirected to `/auth` page

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

Create `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

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
- **Syed Affan** - [GitHub](https://github.com/affan880) / [LinkedIn](https://linkedin.com/in/syed-affan)
- **Jessica Hackett** - [GitHub](https://github.com/mooglemoxie0018) / [LinkedIn](https://www.linkedin.com/in/jessica-hackett/)
- **Vincent Bui** - [GitHub](https://github.com/VincentBui0) / [LinkedIn](https://www.linkedin.com/in/vincent-bui0/)
- **Dorene St.Marthe** - [GitHub](https://github.com/Dorene-StMarthe) / [LinkedIn](https://www.linkedin.com/in/dorenestmarthe/)

### Project Goals
- Demonstrate modern React/Next.js development practices
- Implement BEM methodology with SCSS preprocessing
- Show Firebase authentication integration
- Create a scalable and maintainable codebase
- Provide learning resources for fellow developers

## 🤝 Contributing

This is a learning project for Chingu Voyage. Feel free to:
- Fork and extend for your own projects
- Add new features and components
- Improve documentation
- Share your improvements

## 📄 License

MIT License - feel free to use this skeleton for your own projects!
