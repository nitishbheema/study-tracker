# StudyTrack 🎯

A personal study tracker web app with Firebase login, TCS 30-day prep tracker, general task tracker, and Excel plan uploader.

---

## 🚀 Setup & Deploy Guide

### Step 1 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name (e.g. `study-tracker`)
3. Disable Google Analytics (optional) → **Create project**

### Step 2 — Enable Authentication

1. In Firebase console → **Authentication** → **Get started**
2. Click **Email/Password** → Enable → **Save**

### Step 3 — Enable Firestore

1. In Firebase console → **Firestore Database** → **Create database**
2. Choose **Start in test mode** → select a location → **Done**

### Step 4 — Get Firebase Config

1. In Firebase console → Project Settings (gear icon) → **General**
2. Scroll down → **Your apps** → click **</>** (Web)
3. Register app → copy the `firebaseConfig` object

### Step 5 — Add Config to Project

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Step 6 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/study-tracker.git
git push -u origin main
```

### Step 7 — Deploy to GitHub Pages

1. In `package.json`, update the `homepage` field:
```json
"homepage": "https://YOUR_USERNAME.github.io/study-tracker"
```

2. Install gh-pages and deploy:
```bash
npm install
npm run deploy
```

3. Go to your repo on GitHub → **Settings** → **Pages**
4. Source: **Deploy from a branch** → branch: `gh-pages` → **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/study-tracker`

---

## 🛠 Run Locally

```bash
npm install
npm start
```

---

## 📁 Features

- **Login / Signup** — separate account per user via Firebase Auth
- **TCS 30-Day Tracker** — full schedule with day selector, progress bar, topic per day
- **General Tracker** — add tasks with category + deadline, filter, mark done
- **Excel Planner** — upload any .xlsx timetable and track it as a plan

---

## ⚠️ Firestore Rules (for production)

Change test mode rules to secure rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tcs_progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /general_tasks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
