# Vendor Onboarding Backend - Node.js

This is the Node.js TypeScript implementation of the Vendor Onboarding backend API.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## How to Run

1. Navigate to the backend-node directory:

   ```
   cd backend-node
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or with yarn:

   ```
   yarn install
   ```

3. Run the development server (with auto-reload):

   ```
   npm run dev
   ```

   or with yarn:

   ```
   yarn dev
   ```

4. For production, build and run:
   ```
   npm run build
   npm start
   ```
   or with yarn:
   ```
   yarn build
   yarn start
   ```

## Docker

**Prerequisites:** Docker installed.

1. From the project root, navigate to the backend-node directory:

   ```
   cd backend-node
   ```

2. Build the Docker image:

   ```
   docker build -t vendor-onboarding-backend-node .
   ```

3. Run the container (API on port 3000):
   ```
   docker run -p 3000:3000 vendor-onboarding-backend-node
   ```

## Database

The application uses an SQLite in-memory database which is initialized on startup. The database is not persistent and will reset when the application is restarted.
