# Mahika Mangaonkar — Portfolio

A personal portfolio website showcasing AI/ML and Full-Stack development projects, technical competencies, certifications, and an integrated **360dialog WhatsApp Business API** contact notification backend.

---

## 📁 Project Structure

```text
Portfolio/
├── frontend/
│   ├── index.html                  # Main portfolio landing page
│   ├── projects.html               # Dedicated projects showcase page
│   ├── css/
│   │   └── style.css               # Main styling & visual design system
│   ├── js/
│   │   ├── main.js                 # Landing page interactivity & contact handler
│   │   └── projects.js             # Projects page filtering, 3D tilt & cursor effects
│   └── assets/
│       ├── images/                 # Portfolio showcase images & icons
│       └── documents/              # Professional documents (Resume.pdf)
│
├── backend/
│   ├── server.js                   # Express API server & contact route handling
│   ├── whatsapp.js                 # 360dialog WhatsApp API integration module
│   ├── package.json                # Backend dependencies & script definitions
│   ├── .env.example                # Environment variables template
│   └── .gitignore                  # Backend ignore rules
│
├── README.md                       # Project documentation
└── .gitignore                      # Root repository ignore configuration
```

---

## 🚀 Getting Started Locally

### 1. Frontend
You can serve the static frontend files from the `frontend/` directory using any HTTP server:

```bash
# Option A: Using npx serve
npx serve frontend -p 5500

# Option B: VS Code Live Server extension
# Open frontend/index.html and click "Go Live" (defaults to http://127.0.0.1:5500)
```

### 2. Backend
The backend runs on **Node.js + Express** to process contact form submissions and dispatch real-time notifications to WhatsApp via 360dialog.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start local server
npm start
```

The backend server will launch on port `5000` (or `process.env.PORT`).

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory by copying `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Configure your environment variables inside `backend/.env`:

```env
D360_API_KEY=your_360dialog_api_key
D360_API_URL=https://waba-v2.360dialog.io
D360_PHONE_NUMBER=your_whatsapp_business_number
D360_TEMPLATE_NAME=portfolio_contact_notification
D360_TEMPLATE_LANGUAGE=en
MY_NAME=Mahika
PORT=5000
FRONTEND_URL=http://127.0.0.1:5500
```

> [!IMPORTANT]
> Never commit `.env` or sensitive API keys to source control. The root `.gitignore` excludes `.env` files automatically.

---

## 🌐 Deployment Setup

- **Frontend**: Deploy the `frontend/` directory to static hosting platforms like Vercel, Netlify, or GitHub Pages.
- **Backend**: Deploy the `backend/` directory to Node.js hosting platforms like Render, Railway, or Heroku.
- Set `window.PORTFOLIO_API_URL = "https://your-backend-service.onrender.com"` in `frontend/js/main.js` or via environment config when pointing to a production backend URL.
