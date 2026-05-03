# WebTech E-Learning Platform (MERN Stack)

## Prerequisites

- Node.js (v16 or above)
- A MongoDB Atlas account (free tier works)

---

## Setup Instructions

### Step 1 — Fix MongoDB Atlas IP Whitelist

This is required or the server will crash on startup.

1. Go to https://cloud.mongodb.com
2. Sign in and open your project
3. Click **Network Access** in the left sidebar
4. Click **Add IP Address**
5. Click **Allow Access from Anywhere** (sets 0.0.0.0/0)
6. Click **Confirm**

### Step 2 — Configure Environment Variables

The .env file is included with working credentials.
If missing, copy .env.example to .env and fill in your values.

### Step 3 — Install Dependencies

Backend:
  cd WebTech-project-main
  npm install

Frontend:
  cd WebTech-project-main/client
  npm install

### Step 4 — Run the Project

Option A — Start both with one command (recommended):
  cd WebTech-project-main
  npm run dev:full

Option B — Two terminals:
  Terminal 1: cd WebTech-project-main && npm run dev
  Terminal 2: cd WebTech-project-main/client && npm start

### Step 5 — Open in Browser

  http://localhost:3000

The backend API runs on http://localhost:5000
