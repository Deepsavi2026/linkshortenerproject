# UI Components Guidelines

## shadcn/ui Standards

**CRITICAL**: All UI elements in this application MUST use shadcn/ui components.

### Rules

1. **Never Create Custom Components**
   - Always use existing shadcn/ui components
   - Do not build custom buttons, inputs, cards, or other UI primitives
   - If a component doesn't exist, extend shadcn/ui components using their composition patterns

2. **Component Usage**
   ```tsx
   // ✅ CORRECT
   import { Button } from "@/components/ui/button"
   import { Input } from "@/components/ui/input"
   import { Card, CardContent, CardHeader } from "@/components/ui/card"
   
   // ❌ INCORRECT
   import CustomButton from "@/components/custom-button"
   ```

3. **Styling**
   - Use Tailwind CSS utilities for customization
   - Apply variants through shadcn/ui's built-in variant system
   - Use `className` prop for additional styling

4. **Available Components**
   Check shadcn/ui documentation for the full list of available components:
   - Forms: Button, Input, Label, Select, Checkbox, Radio, etc.
   - Layout: Card, Separator, Tabs, Dialog, Sheet, etc.
   - Feedback: Alert, Toast, Progress, Skeleton, etc.
   - Navigation: NavigationMenu, Breadcrumb, Pagination, etc.

5. **Installation**
   When a new component is needed:
   ```bash
   npx shadcn@latest add [component-name]
   ```

### Examples

```tsx
// Form with shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  return (
    <form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <Button type="submit">Sign In</Button>
      </div>
    </form>
  )
}
```

## Component Composition

When shadcn/ui doesn't have exactly what you need, compose existing components:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StatCard({ title, value, status }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
```

## Key Takeaway

**No custom UI primitives. shadcn/ui components only.**
