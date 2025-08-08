# Deployment Guide - Care Flow

## 🚀 Netlify Deployment

This application is configured for deployment on Netlify with server-side rendering support for API routes.

### Configuration Files

#### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Handle API routes
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200

# Handle all other routes
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200
```

### Environment Variables

Make sure to set these environment variables in your Netlify dashboard:

#### Required Variables
- `GEMINI_API_KEY` - Your Gemini Pro API key
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID

### Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Set Environment Variables**: Add all required environment variables in Netlify dashboard
3. **Deploy**: Netlify will automatically build and deploy using the configuration in `netlify.toml`

### Build Process

1. **Install Dependencies**: `npm install`
2. **Build Application**: `npm run build`
3. **Publish**: Netlify serves from `.next` directory
4. **API Routes**: Handled by Netlify Functions via the Next.js plugin

### Features Supported

✅ **Static Pages**: Home, auth, status pages  
✅ **Dynamic Pages**: Patient management pages  
✅ **API Routes**: `/api/chat` with Gemini Pro integration  
✅ **Server-Side Rendering**: Full SSR support  
✅ **Environment Variables**: Secure configuration  

### Troubleshooting

#### Build Errors
- Ensure all environment variables are set
- Check Node.js version (18+ required)
- Verify API keys are valid

#### API Route Issues
- Ensure `GEMINI_API_KEY` is set correctly
- Check Netlify Functions logs for errors
- Verify the Next.js plugin is installed

#### Performance
- Static pages are pre-rendered for optimal performance
- API routes are serverless functions
- Images are optimized automatically

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Production Features

- **AI Chat**: Fully functional Gemini Pro integration
- **Authentication**: Firebase auth with role-based access
- **Patient Management**: Complete CRUD operations
- **Real-time Updates**: Firebase real-time listeners
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant

### Security

- Environment variables are encrypted
- API keys are server-side only
- Firebase security rules enforced
- Role-based access control
- Input validation and sanitization

This configuration ensures your Care Flow application deploys successfully with full functionality including the AI chat feature powered by Gemini Pro. 