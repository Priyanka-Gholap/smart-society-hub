# Architecture Overview

## Core Layers

- Backend: Express server with Mongoose models, JWT auth, authorization middleware, and REST APIs for societies, alerts, complaints, resources, and safety status.
- Frontend: React SPA using Vite, React Router, Tailwind CSS, and Framer Motion for animation.
- Real-time: Socket.io on the backend to broadcast society-level notifications and updates.

## Data Flow

1. User authenticates on the frontend.
2. Client stores JWT in `localStorage` and sends it via Axios to protected API endpoints.
3. Backend validates JWT and resolves user/society membership for authorization.
4. Critical updates are emitted through Socket.io rooms named by `society_<id>`.

## Key Models

- `User`: resident profiles, roles, society membership, and authentication.
- `Society`: society profile, disaster settings, member list, and approval status.
- `Complaint`: resident reports with priority, status, and categorization.
- `Alert`, `Evacuation`, `Resource`, `Shelter`: disaster readiness entities.
