# Kubernetes Manifests for Backend Node.js Application

Minimal Kubernetes manifests to run the backend-node application.

## Files

- **deployment.yaml**: Container deployment with 1 replica
- **service.yaml**: ClusterIP service on port 3000

## Deploy

```bash
kubectl apply -f k8s/
```

## Test

```bash
kubectl port-forward svc/backend-node 3000:3000
curl http://localhost:3000
```
