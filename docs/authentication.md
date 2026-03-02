# Authentication Guidelines

## Overview

All authentication in this application is handled exclusively by **Clerk**. No other authentication methods should be implemented or used.

## Core Rules

### 1. Single Auth Provider
- **Use Clerk exclusively** for all authentication and authorization
- Never implement custom auth solutions
- Never integrate alternative auth providers (e.g., NextAuth, Auth0, etc.)

### 2. Protected Routes

#### Dashboard Route (`/dashboard`)
- **MUST** require authentication
- Redirect unauthenticated users to sign-in
- Verify user session on the server side

#### Homepage Route (`/`)
- If user is authenticated, redirect to `/dashboard`
- Only show homepage to unauthenticated users

### 3. Sign In/Sign Up UI
- **Always use modal interface** for Clerk sign-in and sign-up flows
- Never use full-page redirects for authentication forms
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` — the `mode="modal"` prop is required

## Implementation Checklist

When implementing authentication:

- [ ] Use Clerk's `auth()` or `currentUser()` in Server Components
- [ ] Use Clerk's `useAuth()` or `useUser()` in Client Components
- [ ] Verify authentication server-side for protected routes
- [ ] Configure Clerk components in modal mode
- [ ] Set up proper redirects (homepage → dashboard for authenticated users)
- [ ] Protect `/dashboard` and all sub-routes requiring authentication

## Example Patterns

### Server Component Protection
```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')
  // ... protected content
}
```

### Homepage Redirect
```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')
  // ... public content
}
```

### Modal Sign In/Sign Up Buttons
```tsx
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button>Sign Up</button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
```

## Remember

- Authentication checks should always happen on the **server side**
- Never rely solely on client-side authentication state for security
- Always pass `mode="modal"` to `<SignInButton>` and `<SignUpButton>` — never omit this prop
