# Database Guidelines

## Overview

All database access uses **Drizzle ORM** connected to a **Neon (serverless Postgres)** instance. The singleton `db` client is exported from `@/db` and is the only way code should interact with the database.

## Core Rules

### 1. Use the Shared `db` Client

- **Always** import `db` from `@/db` — never instantiate a new Drizzle/Neon client anywhere else
- Never import `@neondatabase/serverless` directly outside of `db/index.ts`

```ts
// ✅ CORRECT
import { db } from "@/db"

// ❌ INCORRECT
import { drizzle } from "drizzle-orm/neon-http"
const db = drizzle(process.env.DATABASE_URL!)
```

### 2. Database Access Locations

- **Only** access the database inside **Server Components** and **Server Actions**
- Never query the database from Client Components or API Route Handlers unless there is a strong architectural reason
- Pass data down as props from Server Components to Client Components

```ts
// ✅ CORRECT — Server Component
export default async function LinksPage() {
  const links = await db.select().from(linksTable)
  return <LinkList links={links} />
}

// ❌ INCORRECT — Client Component
"use client"
export function LinkList() {
  const [links, setLinks] = useState([])
  useEffect(() => { fetch("/api/links")... }, []) // avoid this pattern
}
```

### 3. Import Table Schemas Directly

Always import table definitions from `@/db/schema` when writing queries.

```ts
import { db } from "@/db"
import { linksTable } from "@/db/schema"
```

---

## Schema Design

The schema lives in `db/schema.ts`. All tables must be defined there using Drizzle's `pgTable` helper.

### Canonical `links` Table

```ts
// db/schema.ts
import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core"

export const linksTable = pgTable("links", {
  id:          serial("id").primaryKey(),
  shortCode:   varchar("short_code", { length: 12 }).notNull().unique(),
  originalUrl: text("original_url").notNull(),
  userId:      varchar("user_id", { length: 256 }).notNull(),   // Clerk userId
  clickCount:  integer("click_count").notNull().default(0),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
})

// Inferred TypeScript types — use these everywhere
export type Link    = typeof linksTable.$inferSelect
export type NewLink = typeof linksTable.$inferInsert
```

### Schema Conventions

| Convention | Rule |
|---|---|
| Table names | `snake_case`, plural (e.g. `links`) |
| Column names | `snake_case` in DB, camelCase in Drizzle definition |
| Primary keys | `serial` auto-increment |
| Timestamps | `timestamp().notNull().defaultNow()` — always store in UTC |
| Clerk user ID | `varchar("user_id", { length: 256 })` — never store the full Clerk user object |
| String lengths | Set explicit `length` on all `varchar` columns |

---

## Query Patterns

### Select — fetch all links for a user

```ts
import { db } from "@/db"
import { linksTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const links = await db
  .select()
  .from(linksTable)
  .where(eq(linksTable.userId, userId))
  .orderBy(desc(linksTable.createdAt))
```

### Select — fetch a single row by column

```ts
const [link] = await db
  .select()
  .from(linksTable)
  .where(eq(linksTable.shortCode, code))
  .limit(1)

if (!link) notFound()
```

### Insert — create a new link

```ts
import { type NewLink } from "@/db/schema"

const newLink: NewLink = {
  shortCode:   "abc123",
  originalUrl: "https://example.com/very/long/path",
  userId:      userId,
}

const [created] = await db
  .insert(linksTable)
  .values(newLink)
  .returning()
```

### Update — increment click count

```ts
import { sql } from "drizzle-orm"

await db
  .update(linksTable)
  .set({ clickCount: sql`${linksTable.clickCount} + 1` })
  .where(eq(linksTable.shortCode, code))
```

### Delete — remove a link (owner-scoped)

```ts
import { and, eq } from "drizzle-orm"

await db
  .delete(linksTable)
  .where(
    and(
      eq(linksTable.id, linkId),
      eq(linksTable.userId, userId)  // always scope deletes to the authenticated user
    )
  )
```

---

## Migrations with drizzle-kit

### Configuration file

`drizzle.config.ts` must live at the **project root** (not inside `public/`):

```ts
// drizzle.config.ts  (project root)
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out:    './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Recommended `package.json` scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate":  "drizzle-kit migrate",
    "db:push":     "drizzle-kit push",
    "db:studio":   "drizzle-kit studio"
  }
}
```

### Workflow

```bash
# 1. Edit db/schema.ts with new tables or columns

# 2a. Development — push directly to Neon (no migration files)
npm run db:push

# 2b. Production — generate a SQL migration file, then apply it
npm run db:generate   # creates a file in ./drizzle
npm run db:migrate    # applies pending migrations

# 3. Inspect data visually
npm run db:studio
```

> **Rule:** Use `db:push` during development. Use `db:generate` + `db:migrate` for any schema change that goes to a shared or production database.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full Neon connection string (pooled). Required at runtime and for drizzle-kit. |

```bash
# .env.local
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

- **Never** hard-code the connection string in source files
- The `DATABASE_URL` environment variable must always end with `?sslmode=require` for Neon

---

## Implementation Checklist

When adding a new database feature:

- [ ] Define the table in `db/schema.ts` using `pgTable`
- [ ] Export `$inferSelect` and `$inferInsert` types from `db/schema.ts`
- [ ] Run `npm run db:push` (dev) or generate a migration (prod)
- [ ] Import `db` only from `@/db`
- [ ] Scope all queries to the authenticated `userId` from Clerk's `auth()`
- [ ] Place all db calls in Server Components or Server Actions (not Client Components)
- [ ] Use `returning()` after `insert`/`update` when the result is needed

---

## Remember

- The `db` client is a singleton — never create a second instance
- Always filter by `userId` for user-owned data — never expose another user's records
- Drizzle queries are fully type-safe; avoid `as any` casts on query results
- Raw SQL (`sql` template tag) is allowed only for expressions Drizzle can't express (e.g. atomic increments)
