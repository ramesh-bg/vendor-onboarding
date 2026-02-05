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

### Advanced Steps

1. Minikube Start (Locally)
   ```shell
   minikube start
   ```
   Enable ingress addon:
   ```shell
   minikube addons enable ingress
   ```
   Verify ingress controller:
   ```shell
   kubectl get pods -n ingress-nginx
   ```
2. Build Docker Image inside Minikube

   Configure Docker to use Minikube’s Docker daemon:

   ```shell
   eval $(minikube docker-env)
   ```

   Build the backend image:

   ```shell
   docker build -t vendor-onboarding-backend-node:latest .
   ```

   Verify image:

   ```shell
   docker images | grep vendor-onboarding
   ```

3. Deploy Kubernetes Manifests

   All Kubernetes manifests are located in the k8s/ folder.

   ```shell
   kubectl apply -f k8s/
   ```

   Or individually:

   ```shell
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

4. Configure Host Mapping (Local Step)

   Get the Minikube IP:

   ```shell
   minikube ip
   ```

   Add the following entry to your hosts file: (/etc/hosts)

5. Start Minikube Tunnel

   Run this command in a separate terminal and keep it running:

   ```shell
   minikube tunnel
   ```

6. Access the Application

   Health check:

   ```shell
   http://api.vendor-onboarding.local/health
   ```

   Expected response:

   ```json
   {
     "status": "ok"
   }
   ```

7. Optional Debugging (Without Ingress)

   ```shell
   kubectl port-forward svc/backend-node 3000:3000
   ```

   ```
   http://localhost:3000/health
   ```

8. Rebuild and Redeploy After Code Changes

   ```shell
   eval $(minikube docker-env)
   docker build -t vendor-onboarding-backend-node:latest .
   kubectl rollout restart deployment backend-node
   ```

9. Cleanup
   ```shell
   kubectl delete -f k8s/
   minikube stop
   ```
