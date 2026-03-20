# Contributing to ApplyX 🚀

First off — **thank you for being here.** Whether you're fixing a typo or building a whole new feature, every contribution matters.

This guide will get you from zero to your first PR in minutes.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making a Pull Request](#making-a-pull-request)
- [Commit Message Guide](#commit-message-guide)
- [Good First Issues](#good-first-issues)

---

## 🤝 Code of Conduct

Be kind. Be constructive. We're all here to build something useful.

- No harassment, gatekeeping, or condescension
- Assume good intent — English may not be everyone's first language
- Critique code, never people

Violations can be reported to the maintainer directly via GitHub.

---

## 💡 Ways to Contribute

You don't have to write code to contribute. Here's everything that helps:

| Type | Examples |
|------|---------|
| 🐛 **Bug reports** | Something broken? Open an issue |
| ✨ **Feature requests** | Have an idea? We want to hear it |
| 🔧 **Code** | Fix bugs, build features, improve performance |
| 📝 **Docs** | Improve the README, fix typos, add examples |
| 🧪 **Testing** | Write tests, catch edge cases |
| 🎨 **Design** | Improve the dashboard UI or extension sidebar |
| 💬 **Community** | Answer issues, review PRs, share the project |

---

## 🏁 Getting Started

### 1. Fork & Clone

```bash
# Fork via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/ApplyX.git
cd ApplyX
```

### 2. Create a Branch

```bash
# Always branch off main
git checkout -b feat/your-feature-name
# or
git checkout -b fix/the-bug-you-found
```

### 3. Set Up the Project

Follow the full setup in [README.md](./README.md). You'll need:
- Node.js 18+
- A Supabase project
- A Groq API key
- Google OAuth credentials

---

## 🛠️ Development Setup

```bash
# Install all dependencies from root
npm install

# Start the web dashboard
cd apps/web && npm run dev

# Start the extension (separate terminal)
cd apps/extension && npm run dev
```

Load the extension in Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select `apps/extension/build/chrome-mv3-dev`

---

## 📁 Project Structure

```
ApplyX/
├── apps/
│   ├── extension/        # Chrome Extension (Plasmo + React)
│   └── web/              # Next.js Dashboard + API routes
└── packages/             # Shared types & utilities
```

**Key files to know:**
- `apps/web/app/api/` — backend API routes (generation, email sending)
- `apps/extension/src/sidebar/` — the LinkedIn sidebar UI
- `apps/web/components/` — reusable dashboard components

---

## 🔃 Making a Pull Request

```bash
# 1. Make your changes
# 2. Test them locally
# 3. Commit (see commit guide below)
git add .
git commit -m "feat: add follow-up email scheduling"

# 4. Push
git push origin feat/your-feature-name

# 5. Open a PR on GitHub
```

### PR Checklist

Before submitting, make sure:

- [ ] Your branch is up to date with `main`
- [ ] The feature/fix works locally end-to-end
- [ ] You haven't committed `.env.local` or any secrets
- [ ] PR title is clear and descriptive
- [ ] You've added a short description of *what* and *why*

**PR title format:**
```
feat: add LinkedIn Easy Apply support
fix: resume not attaching on first send
docs: update Supabase setup instructions
```

---

## ✍️ Commit Message Guide

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no feature/fix |
| `chore:` | Build process, dependencies |
| `test:` | Adding or fixing tests |

```bash
# ✅ Good
git commit -m "feat: add Wellfound job platform support"
git commit -m "fix: email not sending when resume is missing"
git commit -m "docs: add FAQ section to README"

# ❌ Avoid
git commit -m "update stuff"
git commit -m "fix"
git commit -m "WIP"
```

---

## 🙋 Need Help?

- **Stuck on setup?** Open a [GitHub Discussion](https://github.com/KIET7UKE/ApplyX/discussions)
- **Found a bug?** Open an [Issue](https://github.com/KIET7UKE/ApplyX/issues)
- **Have a quick question?** Drop a comment on any relevant issue

---

<div align="center">

Built with 💜 by the community. Every star, issue, and PR keeps this project alive.

**[⭐ Star ApplyX](https://github.com/KIET7UKE/ApplyX)** · **[🐛 Report Bug](https://github.com/KIET7UKE/ApplyX/issues)** · **[💡 Request Feature](https://github.com/KIET7UKE/ApplyX/issues)**

</div>