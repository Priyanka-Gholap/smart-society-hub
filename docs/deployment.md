# Deployment Guide

## Recommended Environment

- Node.js 18+ for server and client builds.
- MongoDB Atlas or managed cluster for production data.
- Vite production build served via static hosting or CDN.

## Server Deployment

1. Build API server dependencies in `server/`.
2. Use environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
3. Run `npm start` or use a process manager like PM2.

## Client Deployment

1. `cd client`
2. `npm run build`
3. Deploy `dist/` to a static host such as Netlify, Vercel, or AWS S3.

## Production Hardening

- Enable HTTPS and CORS restrictions for the API.
- Use strong JWT secrets and rotate them when needed.
- Enable rate limiting and request validation on sensitive routes.
- Use cloud backups for MongoDB and monitor traffic.
