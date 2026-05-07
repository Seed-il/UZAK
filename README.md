# UZAK

UZAK is a full-stack web application with a Node.js/Express backend and a Vite/React frontend.

## Project Structure

```text
src/
  backend/   # Express API server
  frontend/  # Vite React client
docs/        # Project planning and specification docs
```

## Requirements

- Node.js
- npm
- MongoDB Atlas cluster or local MongoDB

## Environment Variables

Create local `.env` files from the example files. Actual `.env` files must not be uploaded to GitHub.

Backend: `src/backend/.env`

```bash
cd src/backend
copy .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/uzak?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_secure_secret
```

For local MongoDB, keep using the localhost URI instead:

```env
MONGO_URI=mongodb://localhost:27017/uzak
```

Frontend: `src/frontend/.env`

```bash
cd src/frontend
copy .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

The backend reads only `MONGO_URI`, so Atlas and local MongoDB use the same startup path. `npm start` runs `src/backend/src/server.js`, loads `src/backend/.env` with `dotenv`, and passes `MONGO_URI` directly to Mongoose.

1. Create a MongoDB Atlas cluster and database user.
2. Add your backend server IP address to Atlas Network Access. For local development, add your current IP address.
3. Copy the Atlas connection string and set it in `src/backend/.env`.
4. Replace the placeholders:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/uzak?retryWrites=true&w=majority
```

- `<username>`: Atlas database user name.
- `<password>`: Atlas database user password. URL-encode special characters such as `@`, `/`, `:` or `#`.
- `<cluster-url>`: Atlas cluster host, for example `cluster0.xxxxx.mongodb.net`.
- `uzak`: database name used by the UZAK backend.

Example:

```env
MONGO_URI=mongodb+srv://uzak_user:replace_with_password@cluster0.xxxxx.mongodb.net/uzak?retryWrites=true&w=majority
```

## Backend Local Run

All backend commands use `src/backend` as the working directory.

```bash
cd src/backend
npm install
npm run dev
```

Production-style start:

```bash
cd src/backend
npm install
npm start
```

Backend root command summary:

```bash
cd src/backend
npm install      # install backend dependencies
npm run dev      # local development server
npm start        # production-style server start
```

## Render Backend Deployment

Deploy the Express backend as a Render Web Service.

Render service settings:

- Root Directory: `src/backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/`

The backend `start` script is already Render-compatible:

```json
"start": "node src/server.js"
```

`src/server.js` reads `process.env.PORT || 5000`, so Render can inject its own `PORT` automatically. Do not hard-code a port in Render.

Render environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/uzak?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
```

- `MONGO_URI`: Required. Use the MongoDB Atlas connection string for production. A localhost URI is still valid for local runs only.
- `JWT_SECRET`: Required. Use a long random value and keep it private.
- `PORT`: Do not set manually on Render. Render provides it at runtime.

Render setup steps:

1. Push the repository to GitHub.
2. In Render, create a new Web Service from the repository.
3. Set Root Directory to `src/backend`.
4. Set Build Command to `npm install`.
5. Set Start Command to `npm start`.
6. Add `MONGO_URI` and `JWT_SECRET` in Environment.
7. In MongoDB Atlas Network Access, allow Render outbound access. For a simple first deployment, allow `0.0.0.0/0`; for stricter production settings, restrict access to Render's documented outbound IPs when available for the service.
8. Deploy and confirm the service root URL returns the backend health response.

## Frontend Local Run

```bash
cd src/frontend
npm install
npm run dev
```

Production build and preview:

```bash
cd src/frontend
npm install
npm run build
npm run preview
```

## GitHub Upload Checklist

- `src/backend/.env` is not committed.
- `src/frontend/.env` is not committed.
- `node_modules/` directories are not committed.
- `dist/` and `build/` outputs are not committed.
- `src/backend/.env.example` is committed.
- `src/frontend/.env.example` is committed.
- `package-lock.json` files are committed for reproducible installs.
- Frontend build passes with `npm run build` in `src/frontend`.

## Files Excluded Before Upload

The root `.gitignore` excludes:

```text
node_modules/
.env
.env.local
.env.*.local
dist/
build/
```

If any excluded file was already tracked before `.gitignore` was added, remove it from Git tracking while keeping the local file:

```bash
git rm --cached src/backend/.env
git rm -r --cached src/backend/node_modules src/frontend/node_modules src/frontend/dist
```

## Suggested GitHub Upload Commands

```bash
git init
git add .
git status
git commit -m "Prepare project for GitHub upload"
git branch -M main
git remote add origin https://github.com/<USER>/<REPOSITORY>.git
git push -u origin main
```
