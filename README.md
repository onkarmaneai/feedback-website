# AnonPulse

Anonymous feedback and question board with admin responses, analytics, and moderation.

## Setup

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env
```

Run database migrations and seed sample data:

```bash
npx prisma migrate dev --name init
npm run seed
```

Start the dev server:

```bash
npm run dev
```

Visit:
- Public board: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Admin analytics: http://localhost:3000/admin/analytics

## Notes
- Admin auth uses the `ADMIN_PASSWORD` + signed cookie session.
- `PUBLIC_ANALYTICS=true` makes the analytics endpoint public.
