# Link Shortener Project

A modern link shortener application built with Next.js 16 (App Router) and Clerk authentication.

## Features

- 🔐 Secure authentication with Clerk
- ⚡ Next.js 16 App Router
- 🎨 Tailwind CSS styling
- 📱 Responsive design
- 🔒 Protected routes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account (free at [clerk.com](https://clerk.com))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your Clerk API keys:

   - Go to [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
   - Copy your **Publishable Key** and **Secret Key**
   - Open `.env.local` in the project root
   - Replace the placeholder values:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Click "Sign Up" to create your first user account

## Project Structure

```
linkshortenerproject/
├── app/
│   ├── layout.tsx          # Root layout with ClerkProvider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── proxy.ts                # Clerk middleware configuration
├── .env.local              # Environment variables (not in git)
└── package.json
```

## Clerk Integration

This project uses the latest Clerk Next.js SDK with the App Router approach:

- ✅ `clerkMiddleware()` in `proxy.ts` for authentication state
- ✅ `<ClerkProvider>` wrapping the entire app
- ✅ `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` components
- ✅ `<SignedIn>` and `<SignedOut>` for conditional rendering

### Important Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- The `proxy.ts` file handles authentication for all routes
- All routes are public by default; opt-in to protection as needed

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk + Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
