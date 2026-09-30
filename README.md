# Little Things — Mini Social Feed

React + Vite frontend and Express + MongoDB backend for a small photo feed. Passwords are AES-GCM encrypted in the browser before signup or login, decrypted by the API, and stored only as bcrypt hashes. Comments are persisted in MongoDB and broadcast to the room for the post over authenticated Socket.IO.

## Local setup

1. Install Node.js and MongoDB. Start MongoDB and create a database for the app.
2. In `backend/.env`, set `PORT=4000`, `MONGO_URI`, and a long random `JWT_SECRET`. Set `LOGIN_ENCRYPTION_KEY` to a shared secret.
3. In `frontend/.env`, set `VITE_API_URL=http://localhost:4000/api`, `VITE_ASSET_URL=http://localhost:4000`, `VITE_SOCKET_URL=http://localhost:4000`, and `VITE_LOGIN_ENCRYPTION_KEY` to the same value as the backend encryption key.
4. Install dependencies with `npm install` from both `backend` and `frontend`.
5. Run the API with `npm start` in `backend`, then run `npm run dev` in `frontend`.

The API listens on port 4000. Uploaded images are saved under `backend/uploads` and served from `/uploads`. The shared encryption key is compiled into the browser bundle so this encrypts the request as specified, but it is not a substitute for HTTPS in production. Use HTTPS and a dedicated deployment key when deploying.

## Main endpoints

- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET|POST /api/posts`, `GET|PATCH|DELETE /api/posts/:id`
- `GET|POST /api/posts/:id/comments`, `DELETE /api/posts/comments/:id`
- Socket.IO events: `post:join`, `post:leave`, `comment:new`, `comment:deleted`
