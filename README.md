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
- MongoDB

## Environment Variables

Create local `.env` files from the example files. Actual `.env` files must not be uploaded to GitHub.

Backend: `src/backend/.env`

```bash
cd src/backend
copy .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/uzak
JWT_SECRET=replace_this_with_secure_secret
```

Frontend: `src/frontend/.env`

```bash
cd src/frontend
copy .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend Local Run

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
