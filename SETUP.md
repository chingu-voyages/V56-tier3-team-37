# Surgery Status App - Setup Guide

This guide will help you set up the Surgery Status App with BEM methodology, SCSS preprocessing, Firebase authentication, and daisyUI components.

## 📋 Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager
- Git for version control
- A Firebase account (optional for demo mode)

## 🚀 Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd V56-tier3-team-37

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

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

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the next available port).

## 🎨 BEM Methodology & SCSS Setup

### What is BEM?

**BEM (Block Element Modifier)** is a naming convention for CSS classes that makes your code more maintainable and scalable.

- **Block**: Standalone entity (e.g., `.header`, `.form`, `.card`)
- **Element**: Parts of a block (e.g., `.header__nav`, `.form__input`)
- **Modifier**: Variations of blocks or elements (e.g., `.card--feature`, `.form__button--primary`)

### SCSS Structure

The project uses SCSS with the following structure:

```
src/app/globals.scss
├── Variables (colors, spacing, typography)
├── Mixins (responsive, utilities)
├── Base styles
├── Layout components (header, footer)
├── Page components (hero, cards)
├── Form components
├── Table components
├── Utility components (alerts, badges)
├── Animations
├── Responsive utilities
└── Print styles
```

### Key SCSS Features Used

1. **Variables**: Define reusable values
   ```scss
   $color-primary: #3b82f6;
   $spacing-md: 1rem;
   ```

2. **Mixins**: Reusable style patterns
   ```scss
   @mixin respond-to($breakpoint) {
     @media (min-width: $breakpoint) { @content; }
   }
   ```

3. **Nesting**: BEM structure with SCSS nesting
   ```scss
   .header {
     &__nav {
       &-item {
         &:hover { /* styles */ }
       }
     }
   }
   ```

4. **Functions**: Color manipulation
   ```scss
   background: darken($color-primary, 10%);
   ```

## 🔥 Firebase Setup (Optional)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "surgery-status-app")
4. Choose whether to enable Google Analytics
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with a nickname
5. Copy the configuration object

### 4. Update Environment Variables

Replace the placeholder values in `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Enable Firebase in Code

1. Uncomment Firebase imports in `src/lib/firebase.ts`
2. Uncomment Firebase code in `src/lib/auth-context.tsx`
3. Remove demo mode notices from pages

## 🎯 Understanding the App Structure

### Routing with Next.js App Router

```
src/app/
├── layout.tsx           # Root layout (applies to all pages)
├── page.tsx            # Home page (/)
├── auth/
│   └── page.tsx        # Authentication page (/auth)
├── patients/
│   └── page.tsx        # Patient list (/patients)
└── add-patient/
    └── page.tsx        # Add patient form (/add-patient)
```

### Component Architecture

```
src/components/
├── Header.tsx          # Navigation header (BEM classes)
└── Footer.tsx          # Footer component (BEM classes)

src/lib/
├── firebase.ts         # Firebase configuration
└── auth-context.tsx    # Authentication context
```

### BEM Class Examples

#### Header Component
```tsx
<header className="header">
  <div className="header__container">
    <div className="header__navbar">
      <div className="header__brand">Surgery Status</div>
      <nav className="header__nav">
        <Link className="header__nav-item">Home</Link>
      </nav>
    </div>
  </div>
</header>
```

#### Form Component
```tsx
<form className="form">
  <div className="form__group">
    <label className="form__label">Email</label>
    <input className="form__input" />
  </div>
  <button className="form__button form__button--primary form__button--wide">
    Submit
  </button>
</form>
```

## 🛠️ Development Workflow

### 1. Adding New Components

When creating new components, follow the BEM methodology:

```tsx
// Component: src/components/NewComponent.tsx
export default function NewComponent() {
  return (
    <div className="new-component">
      <div className="new-component__header">
        <h2 className="new-component__title">Title</h2>
      </div>
      <div className="new-component__content">
        <p className="new-component__text">Content</p>
      </div>
      <button className="new-component__button new-component__button--primary">
        Action
      </button>
    </div>
  );
}
```

### 2. Adding SCSS Styles

Add corresponding styles to `src/app/globals.scss`:

```scss
.new-component {
  background: white;
  border-radius: 0.5rem;
  @include card-shadow;
  
  &__header {
    padding: $spacing-lg;
    border-bottom: 1px solid #e5e7eb;
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  &__content {
    padding: $spacing-lg;
  }
  
  &__text {
    color: #6b7280;
    line-height: 1.6;
  }
  
  &__button {
    @extend .form__button;
    
    &--primary {
      @extend .form__button--primary;
    }
  }
}
```

### 3. Creating New Pages

1. Create a new folder in `src/app/` for the route
2. Add a `page.tsx` file inside the folder
3. Use BEM classes for styling
4. Add authentication protection if needed

Example:
```tsx
// src/app/new-page/page.tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function NewPage() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading"><div className="loading__spinner"></div></div>;
  }
  
  return (
    <div className="container">
      <div className="py-8">
        <h1 className="text-4xl font-bold">New Page</h1>
        <div className="card">
          <div className="card__body">
            <h2 className="card__title">Content</h2>
            <p className="card__content">Your content here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Customizing Styles

### 1. Colors

Update color variables in `src/app/globals.scss`:

```scss
// Colors
$color-primary: #your-primary-color;
$color-secondary: #your-secondary-color;
$color-success: #your-success-color;
$color-warning: #your-warning-color;
$color-error: #your-error-color;
$color-info: #your-info-color;
```

### 2. Typography

Update font variables:

```scss
$font-family-base: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 3. Spacing

Update spacing scale:

```scss
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;
```

### 4. Breakpoints

Update responsive breakpoints:

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

## 🔧 Troubleshooting

### Common Issues

1. **SCSS not compiling**
   - Ensure `sass` is installed: `npm install sass`
   - Check that `globals.scss` is imported in `layout.tsx`

2. **BEM classes not working**
   - Verify class names follow BEM convention
   - Check that styles are defined in `globals.scss`
   - Ensure no CSS conflicts with Tailwind

3. **Firebase not working**
   - Verify environment variables are set correctly
   - Check that Firebase code is uncommented
   - Ensure Authentication is enabled in Firebase Console

4. **Routing issues**
   - Verify file structure follows App Router conventions
   - Check that `page.tsx` files are in correct folders
   - Ensure proper imports and exports

### Development Tips

1. **Use Browser DevTools** to inspect BEM classes
2. **Check Network tab** for SCSS compilation errors
3. **Use React DevTools** to debug component state
4. **Check Console** for JavaScript errors

## 📚 Learning Resources

- [BEM Methodology](http://getbem.com/)
- [SCSS Documentation](https://sass-lang.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [daisyUI Components](https://daisyui.com/)

## 🚀 Next Steps

After setting up the app, you can:

1. **Add more pages** following the same patterns
2. **Create new components** using BEM methodology
3. **Integrate with a database** (Firestore, Supabase, etc.)
4. **Add more authentication providers** (Google, GitHub, etc.)
5. **Implement real-time features** with Firebase
6. **Add testing** with Jest and React Testing Library
7. **Deploy to production** on Vercel or other platforms

## 🤝 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the code examples in this guide
3. Consult the learning resources
4. Check the project's README.md for additional information

Happy coding! 🎉 