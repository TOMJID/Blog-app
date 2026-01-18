## 1. Server Configuration

| Variable | Description                                | Example |
| -------- | ------------------------------------------ | ------- |
| `PORT`   | Port on which your Node.js server will run | `3000`  |

---

## 2. Database Configuration

| Variable       | Description                           | Example                                                            |
| -------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL` | URL of your database (local or cloud) | `postgresql://username:password@localhost:5432/mydb?schema=public` |

---

## 3. Frontend Configuration

| Variable       | Description                                                | Example                 |
| -------------- | ---------------------------------------------------------- | ----------------------- |
| `FRONTEND_URL` | URL of your frontend site (used for redirects, CORS, etc.) | `http://localhost:3000` |

---

## 4. BetterAuth Configuration

| Variable             | Description                              | Example                          |
| -------------------- | ---------------------------------------- | -------------------------------- |
| `BETTER_AUTH_SECRET` | Secret key for BetterAuth authentication | `mySuperSecretKey123`            |
| `BETTER_AUTH_URL`    | URL of BetterAuth service                | `https://betterauth.example.com` |

---

## 5. Google OAuth (Optional, for login)

| Variable               | Description                | Example                                              |
| ---------------------- | -------------------------- | ---------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     | `1234567890-abc123def456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-abc123def456`                                |

---

## 6. Gmail SMTP (for sending emails)

> **Important:** You must use a **Gmail App Password**, not your regular Gmail password.

| Variable         | Description                                   | Example              |
| ---------------- | --------------------------------------------- | -------------------- |
| `GMAIL_NAME`     | Your Gmail email address                      | `yourname@gmail.com` |
| `GMAIL_APP_PASS` | Gmail App Password (16 characters, no spaces) | `mdnvcizrklvldqof`   |

**How to get a Gmail App Password:**

1. Go to [Google Account → Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Click **App passwords**
4. Select **Mail** and **Other (Custom name)** → name it `nodemailer`
5. Copy the 16-character password (remove spaces if any) and put it in `GMAIL_APP_PASS`

---

## Example `.env` file

```env
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

# Frontend
FRONTEND_URL="http://localhost:3000"

# BetterAuth
BETTER_AUTH_SECRET="mySuperSecretKey123"
BETTER_AUTH_URL="https://betterauth.example.com"

# Google OAuth
GOOGLE_CLIENT_ID="idk"
GOOGLE_CLIENT_SECRET="mySuperSecretKey"

# Gmail SMTP
GMAIL_NAME="yourname@gmail.com"
GMAIL_APP_PASS="mySuperSecretKey"
```
