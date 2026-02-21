# Agent Instructions

## 🚨 CRITICAL REQUIREMENT 🚨

**⚠️ YOU MUST READ THE RELEVANT DOCUMENTATION FILES IN `/docs` BEFORE GENERATING ANY CODE ⚠️**

This is not optional. Before writing or modifying any code:

1. **ALWAYS identify which documentation files are relevant** to the task
2. **ALWAYS read the complete content** of those files in `/docs`
3. **ONLY THEN** proceed with code generation following the guidelines

**Failure to read the relevant documentation files will result in code that does not follow project standards.**

---

## 📚 Documentation

All agent instructions and coding standards are in separate files in `/docs`:

- **[Authentication Guidelines](../docs/authentication.md)** - Clerk authentication standards and protected route implementation
- **[UI Components Guidelines](../docs/ui-components.md)** - shadcn/ui component standards and usage rules
## 🚀 Quick Reference

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Neon (Postgres) with Drizzle ORM
- **Auth**: Clerk
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Fonts**: Geist & Geist Mono

### Key Principles
1. **Server Components First** - Use Server Components by default
2. **Type Safety** - Strict TypeScript, no `any` types
3. **Database Access** - Only in Server Components and Server Actions
4. **Authentication** - Always verify on server side
5. **Styling** - Use Tailwind utilities and shadcn/ui components

### Common Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Path Aliases
Use `@/` for imports from project root:
```tsx
import { db } from "@/db"
import { Button } from "@/components/ui/button"
```

---

## ⚠️ FINAL REMINDER ⚠️

**BEFORE generating ANY code, you MUST:**
1. Identify which documentation files in `/docs` are relevant to your task
2. Read the COMPLETE content of those documentation files
3. Follow ALL guidelines and standards specified in those files

**This is mandatory and non-negotiable. Do not skip this step under any circumstances.**