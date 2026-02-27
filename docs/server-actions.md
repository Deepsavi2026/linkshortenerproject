# Server Actions & Data Fetching Guidelines

## Overview

All data mutations and form submissions in this application are handled exclusively through **Next.js Server Actions**. Data reads are performed directly in **Server Components** using `async/await`. Client-side data fetching via `useEffect` is forbidden except in narrow, explicitly justified cases.

---

## Core Rules

### 1. Always Include the `'use server'` Directive

- Every file that exports Server Actions **must** begin with `'use server'` as its very first line
- Alternatively, place `'use server'` at the top of an individual async function when co-locating a single action inside a Server Component file
- **Never** place `'use server'` inside a file that already has `'use client'` — Server Actions cannot live in Client Component files

```ts
// ✅ CORRECT — file-level directive
'use server'

export async function createLink(originalUrl: string) { /* ... */ }
export async function deleteLink(id: number) { /* ... */ }
```

```ts
// ✅ CORRECT — inline directive for a single co-located action
export default async function DashboardPage() {
  async function handleCreate(formData: FormData) {
    'use server'
    // ...
  }
  return <form action={handleCreate}>...</form>
}
```

```ts
// ❌ INCORRECT — 'use server' inside a 'use client' file
'use client'
'use server' // ← impossible; will throw a build error
```

---

### 2. Authenticate Every Mutating Server Action

- **Every** Server Action that reads user-scoped data or performs a mutation **must** call Clerk's `auth()` as the very first operation
- If `userId` is `null`, immediately return `{ success: false, error: 'Unauthorized' }` — do not proceed
- Never assume the caller is authenticated based on UI state alone; the server must verify independently

```ts
// ✅ CORRECT — auth check before any logic
'use server'

import { auth } from '@clerk/nextjs/server'

export async function deleteLink(id: number) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  // safe to proceed
  await db.delete(links).where(eq(links.id, id))
  revalidatePath('/dashboard')
  return { success: true }
}
```

```ts
// ❌ INCORRECT — no auth check, any caller can delete any row
export async function deleteLink(id: number) {
  await db.delete(links).where(eq(links.id, id))
  return { success: true }
}
```

---

### 3. Fetch Data Directly in Server Components

- Prefer fetching data inside `async` Server Components using `await` — no API routes, no `useEffect`, no `useState` for initial data
- Server Components can call `auth()`, query the database, and pass the resulting data down to Client Components as props
- Keep Client Components focused on interactivity only; they should receive fully-resolved data, not fetch it themselves

```tsx
// ✅ CORRECT — data fetched in a Server Component
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const userLinks = await db.select().from(links).where(eq(links.userId, userId))
  return <LinksList links={userLinks} />
}
```

```tsx
// ❌ INCORRECT — data fetched inside a Client Component via useEffect
'use client'

export function LinksList() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetch('/api/links').then(r => r.json()).then(setLinks) // ← avoid this pattern
  }, [])

  return // ...
}
```

---

### 4. Use Server Actions for Form Submissions

- Bind Server Actions directly to the `action` prop of `<form>` elements — no `onSubmit` handlers that call `fetch`
- For Client Components that need to call a Server Action imperatively (e.g., on button click), import the action and call it directly — no wrapping `fetch('/api/...')` calls
- Pass `FormData` as the parameter when binding to a `<form action>`, or use explicit typed arguments when calling programmatically

```tsx
// ✅ CORRECT — action bound via <form action>
import { createLink } from '@/app/actions'

export function CreateLinkForm() {
  return (
    <form action={createLink}>
      <input name="originalUrl" type="url" required />
      <button type="submit">Shorten</button>
    </form>
  )
}
```

```tsx
// ✅ CORRECT — called programmatically from a Client Component
'use client'

import { deleteLink } from '@/app/actions'

export function DeleteButton({ id }: { id: number }) {
  return (
    <button onClick={() => deleteLink(id)}>Delete</button>
  )
}
```

```tsx
// ❌ INCORRECT — wrapping a Server Action in a manual fetch call
'use client'

export function DeleteButton({ id }: { id: number }) {
  return (
    <button onClick={() => fetch(`/api/links/${id}`, { method: 'DELETE' })}>
      Delete
    </button>
  )
}
```

---

### 5. Return Typed Result Objects — Never Throw to the Client

- Server Actions **must** return a discriminated union result object: `{ success: true, data? }` or `{ success: false, error: string }`
- Never `throw` errors from a Server Action — thrown errors surface as unhandled rejections and expose server internals to the client
- Catch all expected database or validation errors internally and map them to the `{ success: false, error }` shape
- Callers (Client Components or other Server Components) should branch on `result.success` to handle both outcomes

```ts
// ✅ CORRECT — typed result object, errors caught internally
'use server'

export async function createLink(originalUrl: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const shortCode = Math.random().toString(36).slice(2, 8)
    await db.insert(links).values({ originalUrl, shortCode, userId })
    revalidatePath('/dashboard')
    return { success: true, data: { shortCode } }
  } catch {
    return { success: false, error: 'Failed to create link. Please try again.' }
  }
}
```

```ts
// ❌ INCORRECT — throwing an error that bubbles to the client
export async function createLink(originalUrl: string) {
  const shortCode = Math.random().toString(36).slice(2, 8)
  await db.insert(links).values({ originalUrl, shortCode, userId }) // throws on failure
}
```

```tsx
// ✅ CORRECT — caller branches on success
'use client'

import { createLink } from '@/app/actions'

async function handleSubmit(formData: FormData) {
  const result = await createLink(formData.get('originalUrl') as string)
  if (result.success) {
    toast(`Short link created: /${result.data.shortCode}`)
  } else {
    toast.error(result.error)
  }
}
```

---

### 6. Always Revalidate After Mutations

- After every successful database mutation, call `revalidatePath()` or `revalidateTag()` so Next.js purges the relevant cached page or data segment
- Use `revalidatePath('/dashboard')` for page-level invalidation when the mutation affects what a page renders
- Use `revalidateTag('tag-name')` for more granular cache invalidation when using `fetch` with cache tags
- Place the revalidation call **after** the database write succeeds, but **before** returning the result

```ts
// ✅ CORRECT — revalidate after write, before return
import { revalidatePath } from 'next/cache'

export async function createLink(originalUrl: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const shortCode = Math.random().toString(36).slice(2, 8)
  await db.insert(links).values({ originalUrl, shortCode, userId })

  revalidatePath('/dashboard') // ← purge dashboard cache
  return { success: true, data: { shortCode } }
}
```

```ts
// ❌ INCORRECT — mutation with no revalidation; dashboard shows stale data
export async function createLink(originalUrl: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const shortCode = Math.random().toString(36).slice(2, 8)
  await db.insert(links).values({ originalUrl, shortCode, userId })
  return { success: true, data: { shortCode } } // ← stale dashboard until next full reload
}
```

---

### 7. Never Return Sensitive Data to the Client

- Strip all internal database fields (e.g., raw `userId`, internal timestamps, join data) before returning values from a Server Action
- Return only the minimum data the client needs to update its UI
- Never reflect back secrets, tokens, or environment-derived values in the result object

```ts
// ✅ CORRECT — only the public short code is returned
return { success: true, data: { shortCode } }
```

```ts
// ❌ INCORRECT — full database row returned, including internal userId
return { success: true, data: newRow } // newRow contains userId, internal timestamps, etc.
```

---

### 8. Server Actions File Location

- **Shared actions** used across multiple features belong in `app/actions.ts`
- **Feature-specific actions** may be co-located in the feature directory (e.g., `app/dashboard/actions.ts`), but must still follow all rules in this document
- **Never** define Server Actions inside a file marked `'use client'`
- If an action is needed in a Client Component, define it in a separate `actions.ts` file and import it

```
// ✅ CORRECT — file structure
app/
  actions.ts              ← shared Server Actions
  dashboard/
    page.tsx              ← Server Component (fetches data directly)
    actions.ts            ← dashboard-specific Server Actions
    LinksList.tsx         ← Client Component (receives data as props)
```

```ts
// ✅ CORRECT — importing a Server Action into a Client Component
'use client'

import { deleteLink } from '@/app/actions' // imported from a 'use server' file
```

```ts
// ❌ INCORRECT — Server Action defined inside a Client Component file
'use client'

export async function deleteLink(id: number) { // ← build error; can't mix directives
  'use server'
  // ...
}
```

---

## Full Example — Shared `app/actions.ts`

```ts
// app/actions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createLink(originalUrl: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    const shortCode = Math.random().toString(36).slice(2, 8)
    await db.insert(links).values({ originalUrl, shortCode, userId })
    revalidatePath('/dashboard')
    return { success: true, data: { shortCode } }
  } catch {
    return { success: false, error: 'Failed to create link. Please try again.' }
  }
}

export async function deleteLink(id: number) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    await db.delete(links).where(eq(links.id, id))
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete link. Please try again.' }
  }
}
```

## Full Example — Server Component Data Fetching

```tsx
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { LinksList } from './LinksList'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const userLinks = await db.select().from(links).where(eq(links.userId, userId))
  return <LinksList links={userLinks} />
}
```

---

## Implementation Checklist

When adding or modifying a Server Action or data-fetching pattern:

- [ ] `'use server'` directive is at the top of the actions file (or the individual function)
- [ ] `auth()` is called first in every mutating or user-scoped action; returns `{ success: false, error: 'Unauthorized' }` if no `userId`
- [ ] Data reads use `async/await` directly in Server Components — no `useEffect` data fetching
- [ ] Forms use the `action` prop to bind Server Actions — no manual `fetch` wrappers
- [ ] All outcomes return `{ success: true, data? }` or `{ success: false, error: string }` — no thrown errors
- [ ] `revalidatePath()` or `revalidateTag()` is called after every successful mutation
- [ ] Only the minimum necessary data is returned — no raw db rows or sensitive fields
- [ ] Actions are placed in `app/actions.ts` or a feature-level `actions.ts` — never in `'use client'` files

---

## Remember

- **`'use server'` first** — every actions file starts with the directive, no exceptions
- **Auth before everything** — `userId` check is always the first operation in a mutating action
- **Server Components fetch, Client Components render** — keep data loading on the server
- **Forms use `action` prop** — no `fetch` wrappers, no `onSubmit` calling an API route
- **Return results, never throw** — typed `{ success, data?, error? }` objects only
- **Revalidate after every write** — stale UI is a bug; always call `revalidatePath()` or `revalidateTag()`
- **Minimal return payload** — strip internal fields; send only what the UI needs
