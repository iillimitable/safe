<div align="center">

# 🗺️ Safe Map

### Community-Driven Area Safety Rating & Incident Reporting Platform

*Empowering communities to report, analyze, and act on safety data in real time.*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 📖 About

**Safe Map** is a full-stack web application that lets citizens report safety conditions in their area using a structured questionnaire. The data is aggregated and visualized as a **Safety Score** — helping people make informed decisions about where they live, work, or travel.

Key highlights:
- 🌐 Supports **15 Indian languages** on the welcome screen
- 📊 Real-time **safety score calculation** based on community reports
- 🗺️ **Incident mapping** with Leaflet interactive maps
- 🔐 Secure **JWT authentication** with role-based access
- 🛡️ Full **Admin moderation panel** with user activity tracking & spam detection

---

## ✨ Features

### 👤 For Users
| Feature | Description |
|---|---|
| **Register / Login** | Secure account creation with gender, age, and profile info |
| **Report Safety** | Submit a detailed area safety questionnaire (lighting, CCTV, police presence, women safety, etc.) |
| **Area Safety Dashboard** | Search any area by **name or pincode** and view its aggregated safety score |
| **Safety Score** | Auto-calculated score rated as: Very Safe / Safe / Moderate / Risky / Very Unsafe |
| **Analytics Charts** | Radar chart (safety factors), Bar chart (day vs night), Pie chart (common issues), Gender breakdown |
| **View Incidents** | Browse community-reported incidents on an interactive map |
| **Post Incident** | Report a real-time incident with location pin |
| **Feedback** | Submit feedback about the platform |
| **Profile** | View and manage your account details |

### 🛡️ For Admins
| Feature | Description |
|---|---|
| **Admin Dashboard** | Overview of platform statistics |
| **User Management** | View all users; click any row to open their full activity detail page |
| **User Activity Detail** | Full profile page per user — complete incident history, safety report history, 7-day spam/abuse detection alert, and quick Ban/Delete actions |
| **Incident Management** | Review and moderate reported incidents |
| **Report Management** | Manage area safety submissions |
| **Feedback Management** | Review and respond to user feedback |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) | Interactive incident maps |
| [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) | Bar, Pie, Radar charts |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Axios](https://axios-http.com/) | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express v4](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose v7](https://mongoosejs.com/) | Database & ODM |
| [JSON Web Tokens](https://jwt.io/) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | API rate limiting (100 req / 15 min) |
| [CORS](https://github.com/expressjs/cors) | Cross-origin resource sharing |

---

## 📁 Project Structure

```
safe-map/
│
├── .env.example                 # Backend env template (copy → .env)
├── .gitignore
├── package.json
│
├── src/                         # ── Backend (Express API) ──
│   ├── index.js                 # Server entry point (port 5000)
│   │
│   ├── models/
│   │   ├── User.js              # name, email, password, gender, age, role
│   │   ├── Incident.js          # title, description, location, coordinates
│   │   ├── Report.js            # area, pincode, responses, calculatedSafetyScore
│   │   └── Feedback.js          # message, contact
│   │
│   ├── routes/
│   │   ├── auth.js              # POST /register, POST /login
│   │   ├── incidents.js         # CRUD for incidents
│   │   ├── reports.js           # POST report, GET /search (by area/pincode)
│   │   ├── feedback.js          # POST feedback
│   │   └── admin.js             # Protected admin endpoints
│   │
│   ├── middleware/              # Auth middleware (JWT verification)
│   └── utils/                   # Helper utilities
│
└── frontend/                    # ── Frontend (React + Vite) ──
    ├── .env.example             # Frontend env template (copy → .env)
    ├── vite.config.js
    │
    └── src/
        ├── main.jsx
        ├── App.jsx              # Route definitions
        ├── index.css            # Global styles
        │
        ├── context/
        │   └── AuthContext.jsx  # Global auth state (token, user)
        │
        ├── components/
        │   ├── Navbar.jsx       # Top navigation bar
        │   └── AdminRoute.jsx   # Admin-only route guard
        │
        ├── pages/
        │   ├── WelcomePage.jsx  # Animated multilingual welcome
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx    # Area search + safety charts
        │   ├── Incidents.jsx    # Incident map viewer
        │   ├── PostIncident.jsx # Report a live incident
        │   ├── ReportForm.jsx   # Detailed safety questionnaire
        │   ├── Profile.jsx      # User profile page
        │   ├── Feedback.jsx     # Feedback submission form
        │   ├── AboutUs.jsx      # About the platform
        │   └── Admin/
        │       ├── AdminPanel.jsx
        │       ├── Dashboard.jsx
        │       ├── UserManagement.jsx   # User list (click row → detail page)
        │       ├── UserDetail.jsx       # Full user activity detail & moderation
        │       ├── IncidentManagement.jsx
        │       ├── ReportManagement.jsx
        │       └── FeedbackManagement.jsx
        │
        └── utils/
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A [MongoDB](https://www.mongodb.com/) instance — local or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- A [LocationIQ](https://locationiq.com/) API key (free tier) for map geocoding

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/safe-map.git
cd safe-map
```

---

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/safe-map
JWT_SECRET=replace_with_a_long_random_secret
```

> 💡 Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

Start the backend server:

```bash
npm run dev
```

API is now running at → `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
```

Open `frontend/.env` and fill in your value:

```env
VITE_LOCATIONIQ_API_KEY=your_locationiq_api_key_here
```

Start the frontend dev server:

```bash
npm run dev
```

App is now running at → `http://localhost:5173`

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

### Reports (Safety Questionnaire)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/reports` | Submit an area safety report | ✅ User |
| `GET` | `/api/reports/search` | Search reports by `areaName` or `pincode` | ✅ User |

### Incidents
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/incidents` | Get all incidents | ✅ User |
| `POST` | `/api/incidents` | Post a new incident | ✅ User |

### Feedback
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/feedback` | Submit platform feedback | ❌ |

### Admin (Protected)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all users with activity counts | 🛡️ Admin |
| `GET` | `/api/admin/users/:id` | Get a single user's full profile + 7-day spam counts | 🛡️ Admin |
| `GET` | `/api/admin/users/:id/activity` | Get a user's full incident & safety report history | 🛡️ Admin |
| `PATCH` | `/api/admin/users/:id/ban` | Toggle ban status for a user | 🛡️ Admin |
| `DELETE` | `/api/admin/users/:id` | Delete a user and all their data | 🛡️ Admin |
| `GET` | `/api/admin/incidents` | List all incidents | 🛡️ Admin |
| `DELETE` | `/api/admin/incidents/:id` | Delete an incident | 🛡️ Admin |
| `GET` | `/api/admin/reports` | List all reports | 🛡️ Admin |
| `DELETE` | `/api/admin/reports/:id` | Delete a report | 🛡️ Admin |
| `GET` | `/api/admin/feedback` | List all feedback | 🛡️ Admin |

---

## 🔒 Authentication & Roles

```
Guest  →  About, Feedback form
User   →  Welcome, Report Safety, Dashboard, Incidents, Post Incident, Profile
Admin  →  All of the above + Full Admin Panel
```

JWT tokens are stored in `localStorage` and sent as `Authorization: Bearer <token>` headers.

---

## 📊 Safety Score Calculation

Each report collects responses across multiple dimensions:

| Factor | Questions |
|---|---|
| Overall Safety | Q1 — Overall area feel |
| Lighting | Q4 — Street lighting quality |
| CCTV Coverage | Q6 — Camera presence |
| Police Presence | Q8 — Police visibility |
| Women Safety | Q12 — Safety for women |
| Day vs Night | Q10 / Q11 — Comparative ratings |
| Common Issues | Q14 — Multi-select issue types |

Scores are averaged across all reports for an area and mapped to:

| Score | Rating |
|---|---|
| 80 – 100 | 🟢 Very Safe |
| 60 – 79 | 🟡 Safe |
| 40 – 59 | 🟠 Moderate |
| 20 – 39 | 🔴 Risky |
| 0 – 19 | ⛔ Very Unsafe |

---

## 🌍 Multilingual Animation

The welcome screen cycles through greetings in **15 languages**:

English, Hindi, Bengali, Gujarati, Kannada, Malayalam, Tamil, Telugu, Punjabi, Odia, Urdu, Manipuri, Sindhi, Santali, and Namaste 🙏

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

---



## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for safer communities across India**

</div>
