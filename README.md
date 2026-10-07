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

It's built for anyone who wants a simple, self-hosted way to see their cash flow without a spreadsheet. The project covers the whole stack: a React SPA, a REST API with JWT authentication, MongoDB aggregation for the dashboard figures, file uploads for profile photos, and server-side Excel generation.

---

## ✨ Features

### Authentication
- Sign up with full name, email, password and an optional profile photo
- Log in with email and password (passwords hashed with **bcrypt**)
- Token-based auth using **JWT** (30-day expiry)
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
- Upload or change your profile picture (JPEG/PNG)
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
| File Uploads | Multer |
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
┌──────────────────────────────────────┐
│              Backend                 │
│   Node.js + Express  (/api/v1/*)     │
│   JWT middleware · Multer · xlsx     │
│   Render Web Service                 │
└──────────────────┬───────────────────┘
                   │  Mongoose
                   ▼
┌──────────────────────────────────────┐
│              Database                │
│   MongoDB  (User, Income, Expense)   │
└──────────────────────────────────────┘
```

1. The React app sends every request through a shared **Axios instance**, which adds the JWT from `localStorage` to the `Authorization` header.
2. Express routes under `/api/v1` pass protected requests through the `protect` middleware. It verifies the token and attaches the user to `req.user`.
3. Controllers read and write data through Mongoose models. Every income and expense document is scoped to the user by `userId`.
4. The dashboard endpoint uses MongoDB **aggregation** (`$match` + `$group`) to calculate totals, then returns everything the dashboard needs in a single response.

---

## 🔄 Application Flow

```text
Sign Up / Login
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
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Auth, income, expense, dashboard logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (protect)
│   │   └── uploadMiddleware.js   # Multer image uploads
│   ├── models/                   # User, Income, Expense schemas
│   ├── routes/                   # Express routers (/api/v1/...)
│   ├── uploads/                  # Uploaded profile images (served statically)
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
│       │   │   ├── Auth/         # Login, SignUp
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
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string used by Mongoose |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs |
| `PORT` | No | Port the API listens on (defaults to `5000`) |
| `CLIENT_URL` | No | Allowed CORS origin (defaults to `*` if unset) |

### Frontend

The frontend doesn't use environment variables. The API base URL is set in [`frontend/expense-tracker/src/utils/apiPaths.js`](frontend/expense-tracker/src/utils/apiPaths.js):

```js
export const BASE_URL = "https://expense-tracker-dn9w.onrender.com";
```

To develop against your local backend, change it to:

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
| POST | `/auth/register` | Register a user and return a JWT | No |
| POST | `/auth/login` | Log in and return a JWT | No |
| GET | `/auth/getUser` | Get the current user's profile | Yes |
| PUT | `/auth/update-user` | Update full name and profile image URL | Yes |
| POST | `/auth/upload-image` | Upload an image (`multipart/form-data`, field `image`) and return its URL | No |

### Income

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/income/add` | Add income (`source`, `amount`, `date`, `icon`) | Yes |
| GET | `/income/get` | List the user's income, newest first | Yes |
| DELETE | `/income/:id` | Delete an income entry | Yes |
| GET | `/income/downloadexcel` | Download income as `.xlsx` | Yes |

### Expense

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/expense/add` | Add an expense (`category`, `amount`, `date`, `icon`) | Yes |
| GET | `/expense/get` | List the user's expenses, newest first | Yes |
| DELETE | `/expense/:id` | Delete an expense | Yes |
| GET | `/expense/downloadexcel` | Download expenses as `.xlsx` | Yes |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Totals, balance, last 30 days of expenses, last 60 days of income, recent transactions | Yes |

Uploaded images are served statically from `/uploads/<filename>`.

---

## 🔑 Authentication

| Step | Implementation |
|---|---|
| **Registration** | `POST /auth/register` validates the required fields and rejects duplicate emails. A Mongoose `pre('save')` hook hashes the password with bcrypt. |
| **Login** | `POST /auth/login` checks the password with `bcrypt.compare`. |
| **Token generation** | `jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" })`, returned in the response body |
| **Token storage** | The frontend saves the token to `localStorage` (not cookies) |
| **Sending the token** | An Axios request interceptor adds `Authorization: Bearer <token>` |
| **Protected API routes** | The `protect` middleware verifies the JWT and loads the user (without the password) into `req.user` |
| **Protected pages** | The `useUserAuth` hook redirects to `/login` when there's no token. Otherwise it fetches `/auth/getUser` to restore the session after a refresh. |
| **Invalid / expired token** | An Axios response interceptor catches `401`, removes the token and redirects to `/login` |
| **Logout** | Clears `localStorage` and the user context, then navigates to `/login` |

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
Environment:      MONGO_URI, JWT_SECRET, CLIENT_URL (your frontend URL)
```

**Frontend: Static Site**

```text
Root Directory:     frontend/expense-tracker
Build Command:      npm install && npm run build
Publish Directory:  dist
```

The frontend uses `BrowserRouter`, so add a **rewrite rule** in Render (Redirects/Rewrites): source `/*`, destination `/index.html`, action **Rewrite**. Without it, reloading a page like `/dashboard` returns a 404.

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
- **Server-side Excel export.** `xlsx` builds the spreadsheet on the API, and the client downloads it as a blob.

---

## 🗺 Future Improvements

- Edit existing income and expense entries
- Budgets and spending limits per category
- Recurring transactions
- Date-range filters and search
- Password reset by email
- Cloud storage for profile images (Render's disk is ephemeral)
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
