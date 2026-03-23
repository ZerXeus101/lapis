# Development & Setup Guide

This document covers the technical setup, installation, and development workflows for the Lapis project.

## Project Architecture

Lapis uses the **Nuxt 4 directory structure** (with core application code inside the `app/` directory) and the latest **Tailwind CSS v4**.

### Key Technologies
- **Nuxt 4:** Enabled via `future: { compatibilityVersion: 4 }` in `nuxt.config.ts`.
- **Tailwind CSS v4:** Integrated using `@tailwindcss/vite` for high-performance styling.
- **shadcn-vue:** A high-quality UI component library built on Radix Vue.
- **Supabase:** Used for the backend, database, and authentication.
- **Vite PWA:** Powered by `@vite-pwa/nuxt` for offline support and installability.
- **Iconify:** Using `@nuxt/icon` for flexible icon support.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (Recommended package manager)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (For local database development)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials.

### Development Server
Start the development server:
```bash
pnpm dev
```

## Technical Notes

### 1. Tailwind v4 Integration
Tailwind v4 is integrated directly via a Vite plugin. Configuration lives in `app/assets/css/tailwind.css` using the new `@theme` block. There is no `tailwind.config.js`.

### 2. shadcn-vue & Nuxt 4 Compatibility
When using shadcn-vue components with Nuxt 4 and the Vue SFC compiler, we use the `/* @vue-ignore */` comment to prevent type resolution errors during static analysis of extended interfaces.

Example:
```typescript
interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
}
```

### 3. Adding New UI Components
To add new shadcn components, use:
```bash
pnpm dlx shadcn-vue@latest add [component-name]
```
Components are automatically placed in `app/components/ui/`.

### 4. Supabase Types
To update your TypeScript types after database changes:
```bash
pnpm update-types
```
*Note: Requires local Supabase stack to be running (`supabase start`).*

### 5. PWA Configuration
PWA settings are managed in `nuxt.config.ts` under the `pwa` block. 
- Manifest details (name, icons, colors) are defined here.
- The service worker is automatically generated during `pnpm build`.
- Update notifications are handled in `app/app.vue` using a sonner toast.

## Deployment
This project is optimized for deployment on **Vercel**. Simply connect your repository and Vercel will handle the Nuxt 4 build and PWA service worker generation automatically.
