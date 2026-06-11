# Smart Society Hub

A full-stack community platform for society management, disaster readiness, and resident coordination.

## Architecture

- `server/`: Node.js + Express backend with MongoDB, JWT authentication, real-time Socket.io events, and society/disaster management APIs.
- `client/`: React + Vite frontend with Tailwind CSS, animation transitions, and dashboard UI.

## Setup

### Server

1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and configure `MONGO_URI`, `JWT_SECRET`, `EMAIL_HOST`, etc.
4. `npm run dev`

### Client

1. `cd client`
2. `npm install`
3. Create `.env` with `VITE_API_URL=http://localhost:5000/api`
4. `npm run dev`

## Notes

- The backend is configured as an ES module package with `type: module` in `server/package.json`.
- `client/` includes Tailwind configuration and a shared API helper for auth token injection.
- Use the `docs/` folder for architecture, roadmap, and deployment guidance.
