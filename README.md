# ShopKart

ShopKart is a MERN e-commerce app built for the [Lab-2029 problem statements](https://github.com/mrinal1224/Lab-2029-Problem-Statements). It is a separate product from the classroom Social Media project: customers register and log in with JWT HttpOnly cookies, browse a MongoDB product catalog, save a wishlist, manage a cart with stock checks, and check out with Razorpay.

Labs 01–06 are implemented in one repo, including the bonus change-password and price-sort features.

## Live demo

| | URL |
|---|---|
| GitHub | [Hollenite/Shopkart-MERN-labs](https://github.com/Hollenite/Shopkart-MERN-labs) |
| Frontend (Vercel) | [shopkart-rosy.vercel.app](https://shopkart-rosy.vercel.app) |
| Backend (Render) | [shopkart-api-nhbg.onrender.com](https://shopkart-api-nhbg.onrender.com) |
| Health check | [shopkart-api-nhbg.onrender.com/health](https://shopkart-api-nhbg.onrender.com/health) |

Register a new account on the live site to try the app. Do not use real personal passwords.

Render’s free web service may sleep after idle time. The first request after that can take 30–60 seconds.

## Tech stack

**Backend:** Node.js, Express 5, MongoDB, Mongoose, bcrypt, jsonwebtoken, cookie-parser, cors, Razorpay

**Frontend:** React 19, Vite, React Router DOM, Axios, Tailwind CSS v4

**Not used** (matches lab constraints): Passport, Clerk, Firebase Auth, Auth0, Redux

## Architecture

```mermaid
flowchart LR
  user[Browser]
  vercel[Vercel_React]
  render[Render_Express]
  atlas[MongoDB_Atlas]
  razorpay[Razorpay]

  user --> vercel
  vercel -->|"HTTPS plus cookies"| render
  render --> atlas
  render --> razorpay
```

Locally the frontend is `http://localhost:5173` and the API is `http://localhost:4567`. In production they are different sites (`vercel.app` and `onrender.com`), so the auth cookie is set with `httpOnly`, `secure`, and `SameSite=None`. Axios sends `withCredentials: true` on authenticated requests.

## Labs implemented

| Lab | What shipped |
|---|---|
| 01 Customer auth | `POST /customers/register` (alias `/create`), login, JWT in an HttpOnly cookie, protected `/customers/me`, logout, MVC layout, bcrypt hashes, password never returned |
| 02 Auth UI | `/register`, `/login`, protected `/home` via `/customers/me`, navbar logout, controlled forms, `withCredentials` |
| 03 Product catalog | Product model, create/list/detail APIs, search and category query params, product cards, details page, loading / error / empty states |
| 04 Wishlist | Add, list, and remove wishlist items for the logged-in customer |
| 05 Shopping cart | Add, update quantity, remove; rejects quantity above stock |
| 06 Checkout and orders | Shipping address validation, Razorpay order, signature verify, order history and detail |
| Bonus | `PATCH /customers/change-password`, `GET /products?sort=price_asc` or `price_desc` |

## Project structure

```text
lab1/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/razorpay.js
│   ├── controllers/
│   ├── middleware/auth.middleware.js
│   ├── models/
│   ├── routes/
│   └── utils/
│       ├── connectDB.js
│       └── generateToken.js
│
└── frontend/
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── pages/
        ├── components/
        ├── context/
        └── services/api.js
```

## Local setup

Prerequisites: Node.js, a MongoDB Atlas (or local) database, and Razorpay test keys if you want checkout.

```bash
git clone https://github.com/Hollenite/Shopkart-MERN-labs.git
cd Shopkart-MERN-labs
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API listens on `http://localhost:4567` (`PORT` in `.env`, default 4567).

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Vite serves `http://localhost:5173`. Keep both terminals running.

Example `backend/.env`:

```env
URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/shopkart
JWT_SECRET=replace-with-a-long-random-secret
PORT=4567
CLIENT_URL=http://localhost:5173
NODE_ENV=development
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

Example `frontend/.env`:

```env
VITE_API_URL=http://localhost:4567
```

`.env` files are gitignored. Never commit secrets.

## Environment variables

### Render (backend)

| Key | Purpose |
|---|---|
| `URL` | MongoDB connection string |
| `JWT_SECRET` | Signs the auth JWT |
| `CLIENT_URL` | Frontend origin, e.g. `https://shopkart-rosy.vercel.app` |
| `NODE_ENV` | `production` on Render |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

Render sets `PORT`. Do not hardcode `4567` in production.

### Vercel (frontend)

| Key | Purpose |
|---|---|
| `VITE_API_URL` | Backend origin, e.g. `https://shopkart-api-nhbg.onrender.com` |

Do not put MongoDB, JWT, or Razorpay secrets on Vercel. Vite inlines `VITE_*` values at **build** time. After changing `VITE_API_URL`, redeploy the frontend.

**No trailing slash** on `CLIENT_URL` or `VITE_API_URL`. A slash turns requests into `...com//customers/login`, which Express rejects.

## API reference

Base URL: `http://localhost:4567` locally, or `https://shopkart-api-nhbg.onrender.com` in production.

Send `Content-Type: application/json`. For protected routes, include cookies (`withCredentials` in Axios, or Postman cookie jar after login).

### Health

| Method | Path | Auth |
|---|---|---|
| GET | `/health` | No |

### Customers

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/customers/register` | No | Body: `fullName`, `email`, `password`, `phone`. 400 missing/short password, 409 duplicate email |
| POST | `/customers/create` | No | Alias of register |
| POST | `/customers/login` | No | Sets HttpOnly `token` cookie. 401 `Invalid credentials` |
| GET | `/customers/me` | Yes | Password stripped |
| POST | `/customers/logout` | Yes | Clears `token` |
| PATCH | `/customers/change-password` | Yes | Body: `oldPassword`, `newPassword` |

### Products

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/products` | No | Create product |
| GET | `/products` | No | Query: `search`, `category`, `sort=price_asc` or `price_desc` |
| GET | `/products/:id` | No | 400 invalid id, 404 not found |

Examples:

```http
GET /products?search=keyboard
GET /products?category=Electronics
GET /products?search=phone&category=Electronics&sort=price_asc
```

### Wishlist (auth required)

| Method | Path |
|---|---|
| POST | `/wishlist/:productId` |
| GET | `/wishlist` |
| DELETE | `/wishlist/:productId` |

### Cart (auth required)

| Method | Path | Notes |
|---|---|---|
| POST | `/cart/:productId` | Increments by 1; 400 if over stock |
| GET | `/cart` | |
| PATCH | `/cart/:productId` | Body: `{ "quantity": 2 }` |
| DELETE | `/cart/:productId` | |

### Orders (auth required)

| Method | Path | Notes |
|---|---|---|
| POST | `/orders/create-payment-order` | Body: `{ "shippingAddress": { "fullName", "phone", "addressLine1", "city", "state", "pincode" } }`. Phone 10 digits, pincode 6 digits |
| POST | `/orders/verify-payment` | Razorpay `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, plus `shopKartOrderId` |
| GET | `/orders` | Current customer’s orders |
| GET | `/orders/:id` | One order owned by the current customer |

## Frontend routes

| Route | Page |
|---|---|
| `/register` | Create account |
| `/login` | Sign in |
| `/` and `/home` | Protected profile + change password |
| `/products` | Catalog (search, category, sort) |
| `/products/:id` | Product details |
| `/wishlist` | Saved products |
| `/cart` | Cart |
| `/checkout` | Address + Razorpay |
| `/orders` | Order list |
| `/orders/:id` | Order detail |

Unauthenticated visits to `/home` redirect to `/login`.

## Deployment

```text
GitHub
  ├── Vercel  (root directory: frontend)
  └── Render  (root directory: backend)
```

### Render

- New Web Service from this GitHub repo
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start` (`node server.js`, not `npm run dev`)
- Add the Render env vars above, then deploy
- Confirm `GET /health` returns `{ "status": "ok" }`

### Vercel

- Import the same repo
- Root Directory: `frontend`
- Framework: Vite, output `dist`
- Set `VITE_API_URL` to the Render URL (**no trailing slash**) **before** the first production build
- `frontend/vercel.json` rewrites all paths to `index.html` so `/products/:id` and `/orders/:id` work on refresh

After Vercel gives a production URL, set Render `CLIENT_URL` to that origin (https, no slash) and let the service restart.

Production cookies use `SameSite=None` and `Secure`. If login returns 200 and `/customers/me` is 401, the browser is blocking the cross-site cookie. Allow cookies for the demo; do not move the JWT into `localStorage`.

## Evaluation checklist

- [ ] Register with `fullName`, email, password (min 6), phone
- [ ] Duplicate email returns 409
- [ ] Password stored as bcrypt; never returned from APIs
- [ ] Login sets an HttpOnly `token` cookie
- [ ] `GET /customers/me` works only when logged in (401 otherwise)
- [ ] Logout clears the cookie
- [ ] Home shows name, email, phone and redirects if logged out
- [ ] Products load from MongoDB (not hardcoded cards)
- [ ] Search, category filter, and price sort hit query params
- [ ] Product details use `/products/:id`
- [ ] Loading, error, and empty catalog states
- [ ] Wishlist add / list / remove
- [ ] Cart add / quantity / remove with stock validation
- [ ] Checkout shipping validation and Razorpay payment
- [ ] Paid orders persist and appear on `/orders`
- [ ] Change password from Home
- [ ] Live frontend talks to Render, not `localhost`
- [ ] Refresh on `/home` and `/products/:id` does not 404 on Vercel
