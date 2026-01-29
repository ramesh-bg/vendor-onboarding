# Vendor Onboarding API Documentation

Simple REST API for managing vendor registrations with email uniqueness enforcement.

## Quick Start

### Prerequisites

- Node.js 16+
- npm

### Installation & Running

```bash
npm install
npm run dev
```

## Base URL

```
${BASE_URL:-http://localhost:3000}
```

## API Endpoints

- **GET** `/api/vendors` — List all vendors
- **POST** `/api/vendors` — Create a new vendor
- **DELETE** `/api/vendors/:id` — Delete a vendor

See [API.md](./API.md) for detailed endpoint documentation.

## Database

- SQLite database stored in `data/vendors.db`
- Configured via `DB_PATH` environment variable in `.env`

## Environment Variables

Create a `.env` file in the project root:

```
DB_PATH=vendors.db
PORT=3000
NODE_ENV=development

```

## API Documentation

- **Detailed Endpoint Reference** → See [API.md](./API.md)
- **Error Responses** → See [API.md](./API.md#error-responses)

## Development

### Project Structure

```
src/
  index.ts              — Express app setup
  db/database.ts        — SQLite connection & initialization
  models/Vendor.ts      — Vendor type definitions
  routes/vendors.ts     — API endpoint handlers
```

### Build & Compile

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```
