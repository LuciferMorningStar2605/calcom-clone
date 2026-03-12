# Cal.com Clone Scheduling Platform

## Overview

This project is a Cal.com-inspired scheduling platform built as a monorepo. It provides a public booking flow, host availability management, event type management, and booking creation against a local SQLite-backed backend.

## Tech Stack

- Next.js
- React
- Express
- Prisma
- SQLite
- TypeScript

## Features

- Public booking pages by username and slug
- Time slot generation based on host availability
- Booking creation and confirmation flow
- Event type management
- Availability management
- SQLite-backed local development setup

## Setup Instructions

```bash
npm install
cd backend
npx prisma generate
```

## Local Development

```bash
npm run dev
```

Backend health check:

```bash
http://localhost:4000/health
```

Frontend:

```bash
http://localhost:3000
```

## Live Demo

Placeholder: add deployed URL here.

## Booking Page Example

```bash
http://localhost:3000/demo/intro-call
```
