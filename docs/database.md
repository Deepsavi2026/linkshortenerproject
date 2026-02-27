# Database Guidelines

## Overview

All database access in this application is handled exclusively through **Drizzle ORM** connected to a **Neon (Postgres)** hosted database. The single shared `db` client is pre-configured in `db/index.ts` and must be the only entry point for all database operations.

## Core Rules

### 1. Always Import `db` from `@/db` — Never Create New Connections

- **Import the shared client** from `@/db` for every database operation
- Never instantiate a new `drizzle(...)` client anywhere else in the codebase
- Never import `drizzle` or `neon` directly outside of `db/index.ts`

```ts
// ✅ CORRECT
import { db } from '@/db';

// ❌ INCORRECT — never create new connections
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL!);
```

### 2. Define All Tables in `db/schema.ts`

- Every table definition **must** live in `db/schema.ts`
- Use Drizzle's `pgTable` factory exclusively — never write raw `CREATE TABLE` statements
- Never scatter table definitions across feature files or other modules

```ts
// ✅ CORRECT — all tables defined in db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  // ...
});

// ❌ INCORRECT — table defined outside db/schema.ts
// app/dashboard/schema.ts  ← never do this
```

### 3. Database Access is Server-Only

- Database queries are **only** allowed inside:
  - **Server Components** (async components without `'use client'`)
  - **Server Actions** (functions marked with `'use server'`)
- **Never** import or call `db` inside a Client Component (`'use client'`)
- Pass data down to Client Components as props after fetching on the server

```ts
// ✅ CORRECT — Server Component
export default async function LinksPage() {
  const userLinks = await db.select().from(links).where(eq(links.userId, userId));
  return <LinkList links={userLinks} />;
}

// ❌ INCORRECT — Client Component
'use client';
import { db } from '@/db'; // never import db in a client component
```

### 4. Always Use Drizzle ORM — Never Write Raw SQL

- All queries must use Drizzle's query builder API
- Never use `db.execute()` or template-literal SQL strings for application queries
- Use Drizzle's helper operators (`eq`, `and`, `or`, `like`, `desc`, `asc`, etc.) from `drizzle-orm`

```ts
// ✅ CORRECT
import { eq } from 'drizzle-orm';
await db.select().from(links).where(eq(links.shortCode, code));

// ❌ INCORRECT — raw SQL
await db.execute(sql`SELECT * FROM links WHERE short_code = ${code}`);
```

### 5. Environment Variable for the Connection String

- The Neon connection string is sourced exclusively from `process.env.DATABASE_URL`
- Never hard-code connection strings in source code
- Never commit credentials to version control
- Ensure `DATABASE_URL` is set in `.env.local` for local development and in the deployment environment for production

### 6. Naming Conventions — `snake_case` for Tables and Columns

- Table names: plural `snake_case` nouns (e.g., `links`, `user_settings`)
- Column names: `snake_case` (e.g., `original_url`, `created_at`, `short_code`)
- TypeScript object keys in `pgTable` should be `camelCase` counterparts of the column names, letting Drizzle handle the mapping automatically

```ts
export const links = pgTable('links', {         // ✅ snake_case table name
  id:          serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),  // ✅ camelCase key, snake_case column
  shortCode:   text('short_code').notNull().unique(),
  userId:      text('user_id').notNull(),
  createdAt:   timestamp('created_at').defaultNow(),
});
```

### 7. Always Export TypeScript Types from the Schema

- After every table definition, export both the select and insert types
- Use `typeof table.$inferSelect` for rows returned by queries
- Use `typeof table.$inferInsert` for objects passed to `db.insert()`
- Use these types throughout the application — never write manual interface duplicates

```ts
export type Link    = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
```

### 8. Use Drizzle's Built-In Column Types

Use Drizzle's pg-core primitives — do not use raw Postgres type strings:

| Need             | Drizzle type                          |
|------------------|---------------------------------------|
| Auto-increment PK| `serial('id').primaryKey()`           |
| Short text       | `text('column_name')`                 |
| Integer          | `integer('column_name')`              |
| Boolean          | `boolean('column_name')`              |
| Timestamp        | `timestamp('column_name')`            |
| Auto timestamp   | `timestamp('created_at').defaultNow()`|
| UUID             | `uuid('id').defaultRandom()`          |

---

## Schema Pattern

```ts
// db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id:          serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode:   text('short_code').notNull().unique(),
  userId:      text('user_id').notNull(),
  createdAt:   timestamp('created_at').defaultNow(),
});

export type Link    = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
```

---

## Query Patterns

All examples below assume the call site is a Server Component or Server Action.

### Select

```ts
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

// All rows matching a condition
const userLinks = await db.select().from(links).where(eq(links.userId, userId));

// Single row
const [link] = await db.select().from(links).where(eq(links.shortCode, code));
```

### Insert

```ts
import { db } from '@/db';
import { links } from '@/db/schema';

await db.insert(links).values({
  originalUrl: 'https://example.com/very-long-path',
  shortCode:   'abc123',
  userId,
});
```

### Update

```ts
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

await db
  .update(links)
  .set({ originalUrl: newUrl })
  .where(eq(links.id, id));
```

### Delete

```ts
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

await db.delete(links).where(eq(links.id, id));
```

---

## Implementation Checklist

When adding or modifying database functionality:

- [ ] Import `db` from `@/db` — not a new connection
- [ ] Table definition added to `db/schema.ts` using `pgTable`
- [ ] Table name and all column names are `snake_case`
- [ ] TypeScript types exported with `$inferSelect` and `$inferInsert`
- [ ] Drizzle ORM query builder used — no raw SQL
- [ ] Query runs inside a Server Component or Server Action only
- [ ] `DATABASE_URL` used for connection — no hard-coded credentials

---

## Remember

- **One connection** — `db` from `@/db`, always
- **One schema file** — `db/schema.ts`, always
- **Server side only** — Server Components and Server Actions, never Client Components
- **Drizzle ORM only** — no raw SQL, no other query libraries
