# 💰 Expense Tracker

A full-stack MERN application for recording income and expenses, visualising where money comes from and where it goes, and exporting transaction history to Excel.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?logo=render&logoColor=white)](https://expense-tracker-frontend-74jc.onrender.com/)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

**[🚀 Live Demo](https://expense-tracker-frontend-74jc.onrender.com/)** · **[📂 GitHub Repository](https://github.com/ctrl-Satwik/Expense-Tracker)**

> The app runs on Render's free tier, so the first request after a period of inactivity can take up to a minute while the backend wakes up.

---

## 📖 Overview

Expense Tracker is a personal finance dashboard. Each user gets a private account where they log income (by source) and expenses (by category). The app then shows:

- their current balance,
- a breakdown of recent activity, and
- charts covering the last 30 days of spending and 60 days of income.

It's built for anyone who wants a simple, self-hosted way to see their cash flow without a spreadsheet. The project covers the whole stack: a React SPA, a REST API with JWT authentication, email verification and password reset, MongoDB aggregation for the dashboard figures, cloud-hosted profile photos, and server-side Excel generation.

---

## ✨ Features

### Authentication
- Sign up with full name, email, password (8+ characters) and an optional profile photo
- **Email verification**: new accounts must confirm their email (sent with **Resend**) before logging in, and can request a new link
- Log in with email and password (passwords hashed with **bcrypt**)
- **Forgot / reset password**: a single-use emailed link that expires after 10 minutes
- Token-based auth using **JWT** (30-day expiry). Resetting a password invalidates older tokens.
- Rate limiting on all public auth endpoints
- Session survives page refreshes (the token is kept in `localStorage` and the user profile is fetched again on load)
- Expired or invalid tokens are cleared automatically and the user is sent back to the login page
- Logout

### Income Management
- Add income with source, amount, date and an emoji icon
- List all income, newest first
- Delete income (with a confirmation dialog)
- Bar chart of income over time
- Download all income as an **Excel (.xlsx)** file

### Expense Management
- Add expenses with category, amount, date and an emoji icon
- List all expenses, newest first
- Delete expenses (with a confirmation dialog)
- Line chart of spending over time
- Download all expenses as an **Excel (.xlsx)** file

### Dashboard
- Summary cards for **Total Balance**, **Total Income** and **Total Expense**
- Pie chart comparing balance, income and expenses
- Recent transactions (income and expenses combined)
- Last 30 days of expenses: list and bar chart
- Last 60 days of income: list and pie chart

### Account
- View your profile and update your display name
- Upload or change your profile picture (JPEG/PNG, up to 5 MB, stored on **Cloudinary**)
- Falls back to an initials avatar when no photo is set

### User Experience
- Responsive layout with a fixed sidebar on desktop and a slide-in drawer menu on smaller screens
- Form validation with toast notifications (`react-hot-toast`)
- Loading spinner while the session is restored

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| HTTP Client | Axios (with request/response interceptors) |
| Charts | Recharts |
| State | React Context API |
| Backend | Node.js + Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JWT (`jsonwebtoken`) + `bcryptjs` |
| Email | Resend |
| File Uploads | Multer (in memory) → Cloudinary |
| Rate Limiting | `express-rate-limit` |
| Excel Export | SheetJS (`xlsx`) |
| Hosting | Render (frontend and backend) |

Other libraries: `emoji-picker-react` (transaction icons), `react-icons`, `moment` (date formatting), `react-hot-toast` (notifications).

---

## 🏗 Architecture

```text
┌──────────────────────────────────────┐
│              Frontend                │
│   React + Vite + Tailwind (SPA)      │
│   Render Static Site                 │
└──────────────────┬───────────────────┘
                   │  REST (JSON) over HTTPS
                   │  Authorization: Bearer <JWT>
                   ▼
┌──────────────────────────────────────┐      ┌──────────────┐
│              Backend                 │─────▶│    Resend    │
│   Node.js + Express  (/api/v1/*)     │      │   (emails)   │
│   JWT · rate limiting · Multer · xlsx│      └──────────────┘
│   Render Web Service                 │      ┌──────────────┐
│                                      │─────▶│  Cloudinary  │
└──────────────────┬───────────────────┘      │   (images)   │
                   │  Mongoose                └──────────────┘
                   ▼
┌──────────────────────────────────────┐
│              Database                │
│   MongoDB  (User, Income, Expense)   │
└──────────────────────────────────────┘
```

1. The React app sends every request through a shared **Axios instance**, which adds the JWT from `localStorage` to the `Authorization` header.
2. Express routes under `/api/v1` pass protected requests through the `protect` middleware. It verifies the token and attaches the user to `req.user`.
3. Controllers read and write data through Mongoose models. Every income and expense query (list, delete, export) is scoped to the logged-in user by `userId`.
4. The dashboard endpoint uses MongoDB **aggregation** (`$match` + `$group`) to calculate totals, then returns everything the dashboard needs in a single response.

---

## 🔄 Application Flow

```text
Sign Up
       ↓
Verification email → /verify-email/:token
       ↓
Login (Forgot Password? → email → /reset-password/:token)
       ↓
JWT issued → stored in localStorage
       ↓
Dashboard (balance, charts, recent transactions)
       ↓
Income / Expense pages → add · delete · download Excel
       ↓
My Account → update name & profile photo
       ↓
Logout → token cleared → Login
```

---

## 📁 Project Structure

```text
Expense-Tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection + legacy-user migration
│   ├── controllers/              # Auth, income, expense, dashboard logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (protect)
│   │   ├── rateLimitMiddleware.js# Auth endpoint rate limits
│   │   └── uploadMiddleware.js   # Multer (memory) image uploads
│   ├── models/                   # User, Income, Expense schemas
│   ├── routes/                   # Express routers (/api/v1/...)
│   ├── utils/                    # Email (Resend), Cloudinary, tokens, Excel
│   ├── uploads/                  # Legacy profile images (new ones go to Cloudinary)
│   ├── server.js                 # App entry point
│   └── package.json
│
├── frontend/
│   └── expense-tracker/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Cards/        # Info cards, transaction rows, avatar
│       │   │   ├── Charts/       # Recharts bar / line / pie wrappers
│       │   │   ├── Dashboard/    # Dashboard widgets
│       │   │   ├── Expense/      # Expense form, list, overview chart
│       │   │   ├── Income/       # Income form, list, overview chart
│       │   │   ├── Inputs/       # Text input, profile photo selector
│       │   │   └── layouts/      # Auth & dashboard layouts, Navbar, SideMenu
│       │   ├── context/          # UserContext (global user state)
│       │   ├── hooks/            # useUserAuth (session restore / guard)
│       │   ├── pages/
│       │   │   ├── Auth/         # Login, SignUp, VerifyEmail, ForgotPassword, ResetPassword
│       │   │   └── Dashboard/    # Home, Income, Expense, MyAccount
│       │   ├── utils/            # API paths, Axios instance, helpers
│       │   ├── App.jsx           # Routes
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS recommended) and npm
- A **MongoDB** database (local install or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/ctrl-Satwik/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend/expense-tracker
npm install
```

---

## 🔐 Environment Variables

### Backend: `backend/.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Expense Tracker <noreply@your-verified-domain.com>

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string used by Mongoose |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `PORT` | No | Port the API listens on (defaults to `5000`) |
| `CLIENT_URL` | Yes | Frontend origin(s), comma-separated. The **first** one is used for links in verification and reset emails; all of them are allowed by CORS. If unset, CORS allows all origins and emails can't be sent. |
| `RESEND_API_KEY` | Yes | [Resend](https://resend.com) API key for sending emails |
| `EMAIL_FROM` | Yes | Sender address. It must use a domain verified in Resend. (`onboarding@resend.dev` only delivers to your own Resend account email, which is fine for testing.) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

All secrets live only on the backend. None of them are exposed to the Vite build.

### Frontend

The frontend doesn't use environment variables. The API base URL is set in [`frontend/expense-tracker/src/utils/apiPaths.js`](frontend/expense-tracker/src/utils/apiPaths.js):

```js
export const BASE_URL = "https://expense-tracker-dn9w.onrender.com";
```

To develop against your local backend, temporarily change it to the line below, and don't commit that change:

```js
export const BASE_URL = "http://localhost:5000";
```

---

## 💻 Running Locally

Run the backend and frontend in **two separate terminals**.

### Terminal 1: Backend

```bash
cd backend
npm run dev      # nodemon, auto-restarts on changes
# or: npm start
```

The API runs at **http://localhost:5000**.

### Terminal 2: Frontend

```bash
cd frontend/expense-tracker
npm run dev
```

Open **http://localhost:5173** (Vite's default port).

### Other frontend scripts

| Command | Description |
|---|---|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 📡 API Reference

Base path: `/api/v1`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register (JSON or `multipart/form-data` with optional `image`) and send a verification email | No |
| POST | `/auth/verify-email/:token` | Verify an email address with the emailed token | No |
| POST | `/auth/resend-verification` | Send a new verification link (generic response) | No |
| POST | `/auth/login` | Log in and return a JWT. Returns `403` with `code: "EMAIL_NOT_VERIFIED"` if the email isn't verified. | No |
| POST | `/auth/forgot-password` | Email a password reset link (generic response) | No |
| POST | `/auth/reset-password/:token` | Set a new password with the emailed token | No |
| GET | `/auth/getUser` | Get the current user's profile | Yes |
| PUT | `/auth/update-user` | Update full name and profile image URL | Yes |
| POST | `/auth/upload-image` | Upload a JPEG/PNG (`multipart/form-data`, field `image`, max 5 MB) to Cloudinary and return its URL | Yes |

### Income

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/income/add` | Add income (`source`, `amount`, `date`, `icon`) | Yes |
| GET | `/income/get` | List the user's income, newest first | Yes |
| DELETE | `/income/:id` | Delete one of the user's income entries (`404` if it isn't theirs) | Yes |
| GET | `/income/downloadexcel` | Download income as `.xlsx` | Yes |

### Expense

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/expense/add` | Add an expense (`category`, `amount`, `date`, `icon`) | Yes |
| GET | `/expense/get` | List the user's expenses, newest first | Yes |
| DELETE | `/expense/:id` | Delete one of the user's expenses (`404` if it isn't theirs) | Yes |
| GET | `/expense/downloadexcel` | Download expenses as `.xlsx` | Yes |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Totals, balance, last 30 days of expenses, last 60 days of income, recent transactions | Yes |

Profile images uploaded before the move to Cloudinary are still served from `/uploads/<filename>`.

---

## 🔑 Authentication

| Step | Implementation |
|---|---|
| **Registration** | `POST /auth/register` validates the name, email format and password length (8+), and rejects duplicate emails. A Mongoose `pre('save')` hook hashes the password with bcrypt. No JWT is issued until the email is verified. |
| **Email verification** | A 32-byte random token from `crypto` is emailed. Only its SHA-256 hash and a 24-hour expiry are stored. Verifying clears the token in a single atomic update, so each link works only once. |
| **Login** | `POST /auth/login` checks the password with `bcrypt.compare`. Unknown emails and wrong passwords get the same `Invalid email or password` response. |
| **Forgot password** | Always returns the same message whether or not the account exists. For real accounts, a hashed, single-use token with a 10-minute expiry is stored and the reset link is emailed. |
| **Reset password** | Enforces 8+ characters, consumes the token atomically, re-hashes the password and sets `passwordChangedAt` so every JWT issued earlier is rejected. It also marks the email as verified. |
| **Token generation** | `jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" })`, returned in the response body |
| **Token storage** | The frontend saves the token to `localStorage` (not cookies) |
| **Sending the token** | An Axios request interceptor adds `Authorization: Bearer <token>` |
| **Protected API routes** | The `protect` middleware verifies the JWT and loads the user (without the password) into `req.user` |
| **Protected pages** | The `useUserAuth` hook redirects to `/login` when there's no token. Otherwise it fetches `/auth/getUser` to restore the session after a refresh. |
| **Invalid / expired token** | An Axios response interceptor catches `401`, removes the token and redirects to `/login` |
| **Logout** | Clears `localStorage` and the user context, then navigates to `/login` |
| **Rate limiting** | Per IP, using Render's proxy header (`trust proxy`): login 20 per 15 min, register 10 per hour, forgot-password 5 per 15 min, reset 10 per 15 min, verify 20 per 15 min, resend verification 5 per 15 min |

**Existing accounts:** accounts created before email verification was added are marked verified automatically when the server starts, so nobody gets locked out.

### 🛡 Security notes

- Users can only list, delete and export their own income and expenses. Delete queries match both the entry ID and the user ID.
- Excel exports are built in memory, so there are no shared temporary files and no chance of one user receiving another's data.
- Profile image uploads require a login. Files are checked for type (JPEG/PNG) and size (5 MB) and stored on Cloudinary, not on Render's disk, which is wiped on every deploy.
- API responses never include password hashes or reset/verification tokens.

---

## 📱 Responsive Design

The UI uses Tailwind's responsive breakpoints for mobile, tablet, laptop and desktop screens:

- **Desktop (`lg` and up):** fixed sidebar with the profile and navigation
- **Mobile and tablet:** sidebar hidden behind a hamburger menu that opens a slide-in drawer with a tap-to-close backdrop
- Dashboard cards and widgets go from one column to two or three as the screen widens
- Charts shrink to fit narrow screens

---

## ☁️ Deployment

### 🚀 Live Demo

**[Open Expense Tracker](https://expense-tracker-frontend-74jc.onrender.com/)**

Both parts of the app run on **[Render](https://render.com/)**:

| Service | Type | URL |
|---|---|---|
| Frontend | Static Site | https://expense-tracker-frontend-74jc.onrender.com/ |
| Backend API | Web Service | https://expense-tracker-dn9w.onrender.com |

### Deploying your own copy on Render

The repository has no `render.yaml`, so you configure the services in the Render dashboard. These settings match the project's scripts:

**Backend: Web Service**

```text
Root Directory:   backend
Build Command:    npm install
Start Command:    npm start
Environment:      MONGO_URI, JWT_SECRET, CLIENT_URL (your frontend URL),
                  RESEND_API_KEY, EMAIL_FROM,
                  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
```

**Resend setup:** create an API key at [resend.com](https://resend.com), add and verify your sending domain (DNS records), then set `EMAIL_FROM` to an address on that domain.

**Cloudinary setup:** create a free account at [cloudinary.com](https://cloudinary.com) and copy the cloud name, API key and API secret from the dashboard. Images are stored in the `expense-tracker/profile-images` folder.

**Frontend: Static Site**

```text
Root Directory:     frontend/expense-tracker
Build Command:      npm install && npm run build
Publish Directory:  dist
```

The frontend uses `BrowserRouter`, so add a **rewrite rule** in Render (Redirects/Rewrites): source `/*`, destination `/index.html`, action **Rewrite**. Without it, reloading a page like `/dashboard` or opening an emailed `/reset-password/...` link returns a 404.

Before building, point `BASE_URL` in `src/utils/apiPaths.js` at your backend service URL.

---

## 📸 Screenshots

> Screenshots coming soon. In the meantime, try the [live demo](https://expense-tracker-frontend-74jc.onrender.com/).

---

## 🎨 UX Highlights

- **Data visualisation:** bar, line and pie charts built from reusable Recharts wrappers with a custom tooltip and legend
- **Emoji icons:** each transaction can have an emoji chosen with a picker, which makes lists easier to scan
- **Confirm before delete:** deletions go through a modal so nothing is removed by accident
- **Reusable components:** shared `Modal`, `Input`, `InfoCard`, `TransactionInfoCard` and layout components

---

## 🧠 Engineering Decisions

- **Separate frontend and backend services.** The React SPA and the Express API are deployed independently, so each can be built, scaled and redeployed on its own.
- **Stateless JWT auth.** The server keeps no sessions. Every protected request carries a bearer token, which suits a separately hosted SPA calling a cross-origin API.
- **Centralised HTTP layer.** A single Axios instance handles auth headers, timeouts and global `401` handling, so pages don't repeat that logic.
- **Lightweight global state.** React Context holds the current user. The app's state is small enough that Redux wasn't needed.
- **Aggregation on the server.** The dashboard's totals and time windows are calculated in MongoDB and returned in one request, so the client doesn't have to download and sum every transaction.
- **Server-side Excel export.** `xlsx` builds the spreadsheet in memory on the API, and the client downloads it as a blob.
- **Hashed, single-use email tokens.** Verification and reset tokens are random values whose SHA-256 hashes are stored, so a database leak doesn't expose usable links. Tokens are cleared atomically, so a link can't be used twice even by two requests at the same moment.
- **External services for state Render can't keep.** Images go to Cloudinary and emails go through Resend's HTTPS API, so the backend keeps nothing on local disk.

---

## 🗺 Future Improvements

- Edit existing income and expense entries
- Budgets and spending limits per category
- Recurring transactions
- Date-range filters and search
- Delete old Cloudinary images when a profile photo is replaced
- Multi-currency support

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

No license has been specified yet.

---

## 👨‍💻 Author

**Satwik Saurav**

- GitHub: [@ctrl-Satwik](https://github.com/ctrl-Satwik)

If you found this project useful, consider giving it a ⭐ on GitHub.
