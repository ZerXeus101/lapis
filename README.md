# Lapis - Nuxt 4 + Tailwind v4 + shadcn-vue

A modern Nuxt 4 starter template utilizing Tailwind CSS v4 and shadcn-vue.

## Project Setup

This project uses the **Nuxt 4 directory structure** (with everything inside the `app/` directory) and the latest **Tailwind CSS v4**.

### Key Technologies
- **Nuxt 4:** Enabled via `future: { compatibilityVersion: 4 }` in `nuxt.config.ts`.
- **Tailwind CSS v4:** Integrated using `@tailwindcss/vite`.
- **shadcn-vue:** UI component library built on Radix Vue.
- **Supabase:** Integrated for backend and authentication.
- **Iconify:** Using `@nuxt/icon` for flexible icon support.

## Notable Setup Details

### 1. Tailwind v4 Integration
Unlike Tailwind v3, v4 is integrated directly via a Vite plugin. The configuration lives in `app/assets/css/tailwind.css` using the new `@theme` block instead of a separate `tailwind.config.js` file.

### 2. shadcn-vue & Nuxt 4 Compatibility
We encountered a specific issue when using shadcn-vue components with Nuxt 4 and the Vue SFC compiler.

**Problem:**
When a component interface `extends` an external type (like `PrimitiveProps` from `radix-vue`), the Vue compiler fails to statically resolve the base type, leading to an error: `Failed to resolve extends base type`.

**Reason:**
This is due to how the Vue SFC compiler analyzes types in a Nuxt 4 `app/` directory structure. It cannot always correctly "crawl" into `node_modules` to find the source interfaces for static prop analysis.

**Current Solution:**
To resolve this, we use the `/* @vue-ignore */` comment before the extended interface. This tells the Vue compiler to skip static analysis for those specific base types and treat them as fallthrough attributes at runtime.

Example:
```typescript
interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
  // ...
}
```

## Installation & Usage

### Installing Components
To add new shadcn components, use the following command:

```bash
pnpm dlx shadcn-vue@latest add [component-name]
```

This will automatically place the component in `app/components/ui/`.

### Using Components
Nuxt 4 is configured to auto-import these components. You can use them directly in your templates:

```vue
<template>
  <Button>Click me</Button>
  <Badge>New</Badge>
</template>
```

Alternatively, you can import them manually:
```typescript
import { Button } from '@/components/ui/button'
```

## Supabase Types

This project uses the Supabase CLI to generate TypeScript types for your database schema. The types are stored in `app/types/database.types.ts`.

### Generating Types
To update your types after making changes to your local database schema (e.g., after a migration or adding functions), run:

```bash
pnpm update-types
```

*Note: This command assumes you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and your local development stack is running (`supabase start`).*

## Development

Make sure to install dependencies:
```bash
pnpm install
```

Start the development server:
```bash
pnpm dev
```

## License
MIT
