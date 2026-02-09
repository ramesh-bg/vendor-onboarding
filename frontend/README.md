# Vendor Onboarding Frontend - Vue 3 + TypeScript + Vite

This is the frontend application for the Vendor Onboarding portal built with Vue 3 using TypeScript and Vite.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## How to Run

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or with yarn:

   ```
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

   or with yarn:

   ```
   yarn dev
   ```

4. For production, build and preview:
   ```
   npm run build
   npm run preview
   ```
   or with yarn:
   ```
   yarn build
   yarn preview
   ```

## Docker

**Prerequisites:** Docker installed.

1. From the project root, navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Build the Docker image:

   ```
   docker build -t vendor-onboarding-frontend .
   ```

3. Run the container (app on port 4200):
   ```
   docker run -p 4200:80 vendor-onboarding-frontend
   ```

## Changing the Backend

The application can work with either the Java or Node.js backend. To change which backend is used:

1. Open the file `src/services/VendorService.ts`
2. Locate the following line:
   ```typescript
   const useNodeBackend = true; // Set to true if using Node backend, false for Java backend
   ```
3. Change the value to:
   - `true` to use the Node.js backend (running on port 3000)
   - `false` to use the Java backend (running on port 3001)
4. Save the file and refresh your application

## Backend URLs

The backend URLs are configured in the `VendorService.ts` file:

- Node.js backend: http://localhost:3000/api
- Java backend: http://localhost:3001/api

Make sure the corresponding backend server is running before trying to use the frontend application.

## Running Tests

To run the tests:

```
npm run test
```

For watch mode:

```
npm run test:watch
```

For coverage report:

```
npm run test:coverage
```

## Layout, design tokens & breakpoints

### Layout

- **Grid**: `.app-grid` — one column by default (form above list); at **1024px** switches to two columns: form column 380px, list column `1fr`, gap `--space-2xl`.
- **Semantics**: `<header>`, `<main>`, `<aside>` (form), `<section aria-label="Vendor directory">` (list).

### Design tokens

Tokens live in **`src/style.css`** (CSS custom properties) and are extended in **`tailwind.config.js`** so utilities like `bg-primary`, `p-md`, `rounded-md` use them.

- **Colors**: RGB triplets (use `rgb(var(--color-primary))` or `rgb(var(--color-primary) / 0.2)`). Semantic names: `--color-primary`, `--color-secondary`, `--color-success` / `--color-danger` / `--color-warning`, `--color-bg` etc.
- **Spacing**: `--space-xs` (4px) through `--space-2xl` (48px).
- **Typography**: `--font-sans` (Inter + system fallbacks), `--font-mono`; sizes `--font-size-xs` (0.75rem) to `--font-size-2xl` (1.5rem); weights 400–700; line heights tight/normal/relaxed.

**Theming**: Light = `:root` / `[data-theme="light"]`; dark = `[data-theme="dark"]` with `color-scheme: dark`. Theme is set on `<html>`, stored in `localStorage`, and can initialize from `prefers-color-scheme` (see `useTheme.ts`).

### Breakpoints

Responsive rules use plain **`@media`** in component styles (no Tailwind `screens`). Use these values for consistency:
