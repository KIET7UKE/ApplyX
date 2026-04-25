<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:8b5cf6&height=200&section=header&text=ApplyX&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Stop%20copy-pasting.%20Start%20landing%20jobs.&descAlignY=60&descSize=20&descColor=c4b5fd" width="100%"/>

<br/>

[![GitHub stars](https://img.shields.io/github/stars/kiet7uke/ApplyX?style=for-the-badge&logo=github&color=6366f1)](https://github.com/kiet7uke/ApplyX/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a78bfa.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Powered by Llama](https://img.shields.io/badge/Powered%20by-Llama%203.1-ec4899.svg?style=for-the-badge)](https://groq.com)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome)](https://github.com/kiet7uke/ApplyX)

<br/>

<a href="https://www.producthunt.com/products/applyx-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-applyx-2" target="_blank" rel="noopener noreferrer"><img alt="ApplyX - Apply to jobs with 1-click personalized outreach | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1102672&theme=light&t=1773946485595"></a>

<br/>
<br/>

> **Apply to jobs with personalized outreach in 1 click — powered by Llama 3 & Groq.**
>
> *The open-source job application tool that actually respects your time.*

<br/>

```
📄 See job post → ⚡ 1 click → 💌 Personalized email sent. Done.
```

<br/>

---

</div>

## 😤 The Problem (You Know This Pain)

```
You:  *copies job description*
You:  *opens ChatGPT*
You:  "Write me a cold email for this job"
GPT:  "Dear Hiring Manager, I am writing to express my keen interest..."
You:  *dies inside*
You:  *does this 30 more times today*
```

**There has to be a better way.**

---

## ⚡ Enter ApplyX

![ApplyX Demo](https://i.imgur.com/placeholder-demo.gif)
> *1-click from LinkedIn post → personalized email sent from your real Gmail. Real demo gif coming — PRs welcome!*

ApplyX is a **Chrome extension + web dashboard** that lives on LinkedIn. Spot a job post, click once, and a laser-targeted cold email — written from *your* resume, in *your* voice — is sent via your real Gmail. No copy-paste. No generic templates. No cringe.

---

## 🔥 Features

| Feature | What it does |
|---|---|
| **⚡ 1-Click Generation** | Reads the LinkedIn post, grabs your resume, writes a tailored email via Groq (Llama 3.1) in ~1 second |
| **📎 Auto-attach Resume** | Your PDF resume is automatically attached to every outreach email |
| **📬 One-Click Send** | Fires the email via your real Gmail — without leaving LinkedIn |
| **🎨 Dynamic Personalization** | Your name, portfolio, and vibe are baked into every message |
| **🔒 Self-Hosted & Private** | Your data lives in **your** Supabase. Zero middlemen. |
| **🆓 Actually Free** | Groq's free tier handles thousands of generations per day |
| **🔑 No OAuth Audit** | Uses Gmail App Password — no Google verification process required |

---

## 🆕 What's new in v2

| v1 | v2 |
|---|---|
| NextAuth + Google Cloud Console setup | Supabase Auth only |
| Gmail API (requires Google app verification) | Nodemailer + Gmail App Password |
| Extension Key to identify users | Supabase JWT token |
| `localhost:3000` hardcoded in extension | Dynamic backend URL — fully self-hostable |
| Only worked on LinkedIn feed page | Works on all LinkedIn pages |
| 7 environment variables | 4 environment variables |

---

## 🚀 Quick Start

> **Prerequisites**: Node.js 18+, a Supabase account, a Groq API key, a Gmail account with 2FA enabled.

### 1. Clone & Install

```bash
git clone https://github.com/kiet7uke/ApplyX.git
cd ApplyX
```

### 2. Deploy the Web App

Deploy to Vercel (recommended):

```bash
cd apps/web
npm install
vercel deploy
```

Or run locally:

```bash
cp .env.example .env.local  # fill in your keys
npm run dev
```

Open `localhost:3000` 🎉

### 3. Load the Chrome Extension

```bash
cd apps/extension
npm install
npm run dev
```

In Chrome → `chrome://extensions` → **Developer Mode ON** → **Load Unpacked** → select `apps/extension/build/chrome-mv3-dev`

### 4. First-time Extension Setup (30 seconds)

1. Go to LinkedIn → click the **ApplyX** floating button (bottom right)
2. Enter your deployed Vercel URL
3. Click **Open Dashboard & Login** → sign in with Google
4. Upload your **resume PDF**
5. Add your **Gmail App Password** (see below)
6. Done ✅ — click **ApplyX Outreach** on any LinkedIn post

---

## 🛠️ Full Infrastructure Setup

<details>
<summary><b>🗄️ Supabase (Database + Auth)</b> — click to expand</summary>

1. Create a free project at [supabase.com](https://supabase.com)
2. In the **SQL Editor**, paste and run the contents of `supabase/schema.sql`
3. Go to **Authentication → Providers → Google** → enable it
4. Add your Google OAuth credentials (Client ID + Secret from Google Cloud Console)
5. Set redirect URL to: `https://your-app.vercel.app/auth-callback`
6. Go to **Authentication → URL Configuration** and set:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth-callback`
7. Note your `Project URL`, `anon public` key, and `service_role` key from **Project Settings → API**

</details>

<details>
<summary><b>🔑 Google OAuth (for Supabase login)</b> — click to expand</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **New Project**
2. APIs & Services → **Credentials** → Create OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URI: `https://xxxx.supabase.co/auth/v1/callback`
3. Required OAuth Scopes: `openid`, `email`, `profile`
4. Save your `Client ID` and `Client Secret` → paste into Supabase Google provider settings

> ✅ No Gmail API. No app verification. No waiting weeks for Google approval.

</details>

<details>
<summary><b>✉️ Gmail App Password (for sending emails)</b> — click to expand</summary>

1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create a new app password → name it `ApplyX`
4. Copy the **16-character password**
5. Paste it into the extension settings or the dashboard Settings page

Your App Password is stored **AES-256 encrypted** in your own Supabase instance.

</details>

<details>
<summary><b>🤖 Groq (AI Engine)</b> — click to expand</summary>

1. Sign up free at [console.groq.com](https://console.groq.com/)
2. Create an API key
3. That's it. Llama 3.1 is absurdly fast (~300 tokens/sec) and the free tier is incredibly generous.

No OpenAI bill. No rate limit anxiety. Just vibes. ✨

</details>

### 🔐 Environment Variables

Create `apps/web/.env.local`:

```bash
# 🤖 AI
GROQ_API_KEY=gsk_...

# 🗄️ Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 🔒 Encryption (exactly 32 characters)
# Generate: openssl rand -base64 24 | tr -d '=+/' | cut -c1-32
ENCRYPTION_KEY=your-32-character-secret-key-here
```

---

## 🗂️ Project Structure

```
ApplyX/
├── apps/
│   ├── extension/                    # 🧩 Chrome Extension (Plasmo + React)
│   │   ├── contents/
│   │   │   ├── LinkedInSidebar.tsx   # Sidebar UI + 4-step setup wizard
│   │   │   └── LinkedInSendEmail.tsx # Inline outreach button on posts
│   │   └── background/
│   │       └── index.ts              # Service worker
│   │
│   └── web/                          # 🌐 Dashboard & Backend (Next.js)
│       ├── app/
│       │   ├── api/
│       │   │   ├── generate-email/   # Groq AI generation
│       │   │   ├── send-email/       # Nodemailer sending
│       │   │   ├── resume/           # Upload + status
│       │   │   └── user/             # Profile + Gmail setup
│       │   ├── (dashboard)/          # Web UI pages
│       │   └── auth-callback/        # OAuth redirect handler
│       ├── hooks/
│       │   └── useAuth.ts            # Shared auth hook
│       └── lib/
│           ├── supabase.ts           # Browser Supabase client
│           ├── supabase-admin.ts     # Server admin client (bypasses RLS)
│           ├── mailer.ts             # Nodemailer Gmail SMTP
│           ├── crypto.ts             # AES-256 encryption
│           └── openai.ts             # Groq / Llama email generation
│
├── supabase/
│   └── schema.sql                    # Full DB schema + RLS policies
│
└── .env.example                      # 4 variables — that's it
```

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    LinkedIn Feed                         │
│                                                         │
│  [Job Post by Recruiter]          ┌──────────────────┐  │
│  "We're hiring a Senior           │   ApplyX Sidebar │  │
│   Backend Engineer at Stripe!"    │                  │  │
│                                   │  [Generate ⚡]   │  │
│                                   └────────┬─────────┘  │
└────────────────────────────────────────────┼────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Your Resume   │
                                    │  + Post Context │
                                    │  + Your Name    │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Groq Llama 3.1 │
                                    │   (~800ms) ⚡   │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Personalized   │
                                    │ Email → Gmail   │
                                    │  SMTP  Sent ✅  │
                                    └─────────────────┘
```

---

## 🤝 Contributing

ApplyX is fully open-source and contributions are very welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-amazing-idea
git commit -m "feat: add your amazing idea"
git push origin feature/your-amazing-idea
# Open a PR 🚀
```

**Ideas for contributions:**
- [ ] 🎯 LinkedIn Easy Apply form auto-fill
- [ ] 📊 Application tracking dashboard
- [ ] 🌐 Support for other job platforms (Wellfound, Lever, Greenhouse)
- [ ] 🔁 Follow-up email scheduling
- [ ] 🧪 A/B testing different email tones
- [ ] 🌍 Multi-language outreach support

---

## 💬 Frequently Asked Questions

**Q: Is this actually free?**
A: Yes. Groq's free tier handles ~14,400 requests/day. You won't hit that limit job hunting.

**Q: Is my resume data safe?**
A: Your resume lives in your own Supabase instance. ApplyX never touches it.

**Q: Do I need to pay for Google Cloud or get OAuth verified?**
A: No. v2 uses Supabase Auth for login and Gmail App Password for sending — no Google Cloud billing, no OAuth consent screen verification required.

**Q: Will recruiters know I used AI?**
A: The output is grounded in *your* real resume and *their* actual job post — it reads as genuinely tailored because it is.

**Q: Does it work with LinkedIn Premium?**
A: Works with any LinkedIn account. Premium not required.

**Q: Which LinkedIn pages does it work on?**
A: All of them — feed, job listings, profiles, company pages, search results.

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kiet7uke/ApplyX&type=Date)](https://star-history.com/#kiet7uke/ApplyX&Date)

---

<div align="center">

**If ApplyX helped you land an interview, drop a ⭐ — it keeps the project alive.**

<br/>

Built with 💜 by [kiet7uke](https://github.com/kiet7uke) and contributors.

*Let's make it smarter, together.*

<br/>

[![Buy Me A Chai](https://buymeachai.ezee.li/assets/images/buymeachai-button.png)](https://buymeachai.ezee.li/kiet7uke)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,100:6366f1&height=100&section=footer" width="100%"/>

</div>
