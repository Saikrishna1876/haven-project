# Haven Project

A **privacy‑first personal safety and wellness platform** built with **Next.js 16**, **Convex**, **Tailwind CSS**, and a suite of modern UI components. The app provides secure authentication, contact vaults, activity monitoring, and wellness checks for users to stay safe and connected.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Running the App Locally](#running-the-app-locally)
- [How to Use](#how-to-use)
- [Usage Guide](#usage-guide)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Official Guides](#official-guides)
- [License](#license)

---

## Project Overview

**Haven** helps users create a trusted network of contacts, receive automated wellness‑check reminders, and quickly trigger emergency actions. It leverages Convex for server‑less functions and data storage, while the front‑end is a fully typed **Next.js** app with **shadcn/ui**, **Radix**, and **Tailwind CSS** for a polished UI.

---

## Features

- **Secure Authentication** – Powered by `@convex-dev/better-auth` and `better-auth` with email/password and social login support.
- **Contact Vault** – Store encrypted emergency contacts and trusted people.
- **Wellness Checks** – Schedule periodic check‑ins; missed checks trigger email alerts.
- **Audit Trail** – Full audit logs for user activity and contact changes.
- **Responsive UI** – Mobile‑first components from `shadcn/ui`, `base-ui`, and custom Tailwind utilities.
- **Email Integration** – Uses `@convex-dev/resend` to send recovery and alert emails.
- **Server‑less Backend** – Convex functions handle data validation, encryption, and scheduled jobs.
- **Theming** – Light/Dark mode with `next-themes`.

---

## Tech Stack

| Layer              | Technology                                                             |
| ------------------ | ---------------------------------------------------------------------- |
| Front‑end          | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| State Management   | React Hook Form, Zod for validation                                    |
| Backend            | Convex (serverless functions, TypeScript)                              |
| Auth               | `@convex-dev/better-auth`, `better-auth`                               |
| Email              | `@convex-dev/resend`                                                   |
| UI Icons           | `@tabler/icons-react`                                                  |
| Data Visualization | Recharts                                                               |
| Testing / Linting  | Biome                                                                  |

---

## Prerequisites

- **Node.js** (>=18) – we recommend using `pnpm` as the package manager (already configured).
- **pnpm** – install via `npm i -g pnpm`.
- **Convex CLI** – `npm i -g convex` (used for local dev server and migrations).
- **Git** – for version control.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your‑org/haven-project.git
cd haven-project

# Install dependencies using pnpm
pnpm install
```

---

## Development

### 1. Set up environment variables

Create a `.env.local` file at the project root (it is ignored by git). Required variables:

```dotenv
# Convex
CONVEX_DEPLOYMENT=your‑convex‑deployment-url
CONVEX_API_KEY=your‑convex‑api‑key

# Auth (Better‑Auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your‑random‑secret

# Resend (email service)
RESEND_API_KEY=your‑resend‑api‑key

# Optional – Vercel analytics, etc.
```

### 2. Run the Convex dev server (in a separate terminal)

```bash
pnpm convex dev
```

### 3. Start the Next.js development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Running the App Locally

1. **Authentication** – Register a new account or use the demo credentials (if provided in the docs).
2. **Dashboard** – After login you land on the private dashboard where you can:
   - Add / edit emergency contacts.
   - Configure wellness‑check frequency.
   - View audit logs.
3. **Email Flow** – Password recovery and alert emails are sent via Resend. Check your inbox for the verification link.

---

## How to Use

Below is a quick‑start walkthrough for typical user flows:

1. **Sign‑up / Sign‑in**

   - Open `http://localhost:3000`.
   - Click **Sign up** and provide an email and password, or use a social provider if configured.
   - Verify your email via the link sent by Resend.

2. **Add Emergency Contacts**

   - After logging in, navigate to **Contacts** from the sidebar.
   - Click **Add Contact**, fill in the required fields (name, phone, email, relationship) and save.
   - The contact data is encrypted on the server and only visible to you.

3. **Configure Wellness Checks**

   - Go to **Wellness Check** in the private dashboard.
   - Choose a frequency (daily, weekly, custom) and set a reminder window.
   - The system will email you a check‑in prompt. If you miss the response window, an alert is automatically sent to all stored contacts.

4. **Trigger an Emergency Manually**

   - From the main dashboard, click **Trigger Emergency**.
   - This sends an immediate email (and SMS if integrated) to all contacts with your location (if shared) and a custom message.

5. **Review Activity Logs**

   - Open **Audit** from the sidebar to see a chronological list of actions such as logins, contact updates, and wellness‑check outcomes.
   - Each entry includes a timestamp and IP address for security monitoring.

6. **Logout**
   - Click your profile avatar in the top‑right corner and select **Logout**.

These steps cover the core interactions a user will perform on the Haven platform.

---

## Usage Guide

The **Usage** section is intended for end‑users and developers who want to understand the core workflows.

### 1. Managing Contacts

- Navigate to **Contacts** from the sidebar.
- Click **Add Contact** and fill in name, phone, email, and relationship.
- Contacts are encrypted on the server; only you can view them.

### 2. Wellness Checks

- Go to **Wellness Check** in the private area.
- Choose a frequency (daily, weekly, custom).
- The system will send you a reminder email. If you do not respond within the configured window, an alert is sent to your trusted contacts.

### 3. Auditing Activity

- Open **Audit** from the sidebar to see a chronological list of actions (login, contact changes, check‑in status).
- Each entry includes a timestamp and IP address for security monitoring.

### 4. Emergency Trigger

- From the dashboard, click **Trigger Emergency** to instantly notify all stored contacts via email and SMS (if integrated).

---

## Environment Variables

| Variable            | Description                      | Example                             |
| ------------------- | -------------------------------- | ----------------------------------- |
| `CONVEX_DEPLOYMENT` | URL of your Convex deployment    | `https://your‑project.convex.cloud` |
| `CONVEX_API_KEY`    | API key for server‑side calls    | `cvy_...`                           |
| `NEXTAUTH_URL`      | Base URL for NextAuth callbacks  | `http://localhost:3000`             |
| `NEXTAUTH_SECRET`   | Random secret for JWT signing    | `a1b2c3d4...`                       |
| `RESEND_API_KEY`    | API key for Resend email service | `re_...`                            |

---

## Testing

The project currently relies on **Biom​e** for linting and formatting. Add unit or integration tests as needed (e.g., using Jest or Playwright). To run linting:

```bash
pnpm lint
```

---

## Building for Production

```bash
pnpm build
```

The output is placed in the `.next` directory and can be served with:

```bash
pnpm start
```

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub.
2. Import the project in Vercel and select the **Next.js** framework.
3. Add the environment variables from the **Environment Variables** section in Vercel's dashboard.
4. Vercel will automatically run `pnpm install && pnpm build` on each push.

### Self‑Hosted

You can also run the built app on any Node.js server:

```bash
npm install -g pm2   # optional process manager
pm2 start npm --name "haven" -- start
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes and ensure linting passes (`pnpm lint`).
4. Write tests if applicable.
5. Open a Pull Request describing the changes.

---

## Official Guides

For deeper understanding and advanced usage, refer to the official documentation of the core technologies used in this project:

- **Next.js** – https://nextjs.org/docs
- **Convex** – https://docs.convex.dev
- **Tailwind CSS** – https://tailwindcss.com/docs
- **shadcn/ui** – https://ui.shadcn.com/docs
- **React Hook Form** – https://react-hook-form.com/get-started
- **Zod** – https://zod.dev
- **Better Auth** – https://github.com/convex-dev/better-auth#readme
- **Resend (email service)** – https://resend.com/docs
- **Vercel Deployment** – https://vercel.com/docs

These guides provide comprehensive reference material, tutorials, and best‑practice recommendations.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

_Happy coding!_
