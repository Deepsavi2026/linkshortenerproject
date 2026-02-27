# Link Shortening Guidelines

## Overview

The link shortening feature is the core of this application. It covers: generating unique short codes, persisting links to the database, redirecting visitors, and tracking click counts. All mutation logic lives in **Server Actions**; all redirect logic lives in a **Next.js dynamic Route Handler**.

## Core Rules

### 1. Short Code Generation

- Short codes are **7-character alphanumeric strings** generated with the Web Crypto API — no external libraries needed
- Short codes must be **URL-safe**: only characters `[A-Za-z0-9]`
- Always verify uniqueness against the database before saving; retry on collision

```ts
// lib/short-code.ts

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const CODE_LENGTH = 7

export function generateShortCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH))
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("")
}
```

### 2. URL Validation

- Always validate the submitted URL before inserting into the database
- Only accept `http://` and `https://` schemes — reject `javascript:`, `data:`, etc.
- Use the built-in `URL` constructor for parsing; catch throws for malformed input

```ts
// ✅ CORRECT
export function isValidUrl(raw: string): boolean {
  try {
    const { protocol } = new URL(raw)
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}

// ❌ INCORRECT — regex alone is unreliable and misses scheme checks
const valid = /^https?:\/\/.+/.test(raw)
```

### 3. Creating a Short Link (Server Action)

All link creation logic must be a **Server Action** in a dedicated `actions/` file. It must:

1. Verify the user is authenticated via Clerk's `auth()`
2. Validate the URL
3. Generate a short code (with collision retry)
4. Insert the record and return the created link

```ts
// app/actions/links.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { linksTable, type NewLink } from "@/db/schema"
import { eq } from "drizzle-orm"
import { generateShortCode } from "@/lib/short-code"
import { isValidUrl } from "@/lib/short-code"

export async function createLink(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const originalUrl = formData.get("url") as string

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return { error: "Please enter a valid http or https URL." }
  }

  // Generate a unique short code (retry up to 5 times on collision)
  let shortCode = ""
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateShortCode()
    const [existing] = await db
      .select({ id: linksTable.id })
      .from(linksTable)
      .where(eq(linksTable.shortCode, candidate))
      .limit(1)

    if (!existing) {
      shortCode = candidate
      break
    }
  }

  if (!shortCode) {
    return { error: "Could not generate a unique short code. Please try again." }
  }

  const newLink: NewLink = { shortCode, originalUrl, userId }
  const [created] = await db.insert(linksTable).values(newLink).returning()

  return { link: created }
}
```

### 4. Redirect Handler

Redirects are handled by a **Next.js Route Handler** at `app/[shortCode]/route.ts`. This keeps redirect logic separate from page rendering and allows returning proper `307`/`404` HTTP responses.

```ts
// app/[shortCode]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { linksTable } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params

  const [link] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.shortCode, shortCode))
    .limit(1)

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", _req.url), { status: 307 })
  }

  // Increment click count (fire-and-forget — do not await)
  void db
    .update(linksTable)
    .set({ clickCount: sql`${linksTable.clickCount} + 1` })
    .where(eq(linksTable.shortCode, shortCode))

  return NextResponse.redirect(link.originalUrl, { status: 307 })
}
```

> **Why 307?** A `307 Temporary Redirect` tells browsers and crawlers not to cache the redirect, which is important for a URL shortener where destinations can be updated.

### 5. Deleting a Link (Server Action)

```ts
// app/actions/links.ts  (add to the same file)
import { and, eq } from "drizzle-orm"

export async function deleteLink(linkId: number) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await db
    .delete(linksTable)
    .where(
      and(
        eq(linksTable.id, linkId),
        eq(linksTable.userId, userId)   // always scope to the authenticated user
      )
    )
}
```

---

## Reserved Short Codes

The following paths are reserved by the application and must **never** be used as short codes. Validate against this list before inserting.

```ts
// lib/short-code.ts
export const RESERVED_PATHS = new Set([
  "dashboard",
  "api",
  "sign-in",
  "sign-up",
  "not-found",
  "favicon.ico",
])

export function isReservedCode(code: string): boolean {
  return RESERVED_PATHS.has(code.toLowerCase())
}
```

---

## File Structure

```
app/
  [shortCode]/
    route.ts           ← redirect handler (GET)
  actions/
    links.ts           ← createLink, deleteLink Server Actions
  dashboard/
    page.tsx           ← lists the authenticated user's links
db/
  schema.ts            ← linksTable definition
lib/
  short-code.ts        ← generateShortCode, isValidUrl, RESERVED_PATHS
```

---

## Implementation Checklist

When implementing or extending the link shortening feature:

- [ ] Short codes generated with `generateShortCode()` from `@/lib/short-code`
- [ ] URL validated with `isValidUrl()` before any database write
- [ ] Short code checked against `RESERVED_PATHS` before inserting
- [ ] Collision retry loop (up to 5 attempts) in the create action
- [ ] All mutations in Server Actions with `"use server"` directive
- [ ] `auth()` called at the top of every Server Action; redirect if unauthenticated
- [ ] Delete actions scoped to the authenticated `userId`
- [ ] Redirect route returns `307` status code
- [ ] Click count increment is fire-and-forget (does not block the redirect)

---

## Example Patterns

### Dashboard — list user's links (Server Component)

```tsx
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { linksTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const links = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.createdAt))

  return <LinkTable links={links} />
}
```

### Create Link Form (Client Component calling a Server Action)

```tsx
// app/dashboard/_components/create-link-form.tsx
"use client"

import { useActionState } from "react"
import { createLink } from "@/app/actions/links"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateLinkForm() {
  const [state, action, pending] = useActionState(createLink, undefined)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="url">Destination URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com/long-path"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Shortening…" : "Shorten URL"}
      </Button>
    </form>
  )
}
```

---

## Remember

- Short codes are generated server-side only — never in the browser
- Always validate URLs on the server, even if you add client-side validation later
- Scope every database query to the authenticated `userId` — never expose other users' links
- The redirect route (`app/[shortCode]/route.ts`) must not be a Page — it must be a Route Handler so it returns proper HTTP redirects
- Click tracking must not block the redirect response; use fire-and-forget
