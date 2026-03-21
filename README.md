# GreyBox — AI Agent Observability

> Agents are black boxes. We fix that.

GreyBox gives you complete observability into your AI agents — every decision, every tool call, every reasoning step.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Auth**: Clerk (email magic link, free tier: 10K MAU)
- **Database**: PostgreSQL via Neon (free tier: 0.5GB storage, 1 project)
- **Payments**: Stripe ($29/mo Pro tier)
- **Styling**: CSS Modules with CSS variables (dark theme)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/burninmedia/greybox-mvp.git
cd greybox-mvp
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_...`) |
| `CLERK_SECRET_KEY` | Clerk secret key (`sk_...`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Stripe Price ID for Pro tier |

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

### Log an Agent Event

```bash
curl -X POST http://localhost:3000/api/v1/log \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_abc123",
    "sessionId": "sess_xyz789",
    "action": "web_search",
    "reasoning": "User asked about weather in NYC",
    "confidence": 0.94,
    "tools": ["web_search", "calculator"]
  }'
```

**Response:**
```json
{ "success": true, "eventId": "uuid-here" }
```

### Rate Limits

- **Free tier**: 10,000 events/month
- **Pro**: Unlimited events

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Domain

Point `greybox.fyi` → Vercel deployment (Stephen's domain).

## Project Structure

```
greybox-mvp/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Protected dashboard
│   │   ├── page.tsx          # Server component wrapper
│   │   └── DashboardClient.tsx  # Client component UI
│   ├── api/
│   │   ├── v1/log/           # POST /api/v1/log
│   │   ├── webhook/          # Stripe webhook handler
│   │   ├── create-checkout/  # Stripe checkout session
│   │   └── onboarding/       # First-time API key generation
│   └── sign-up/, sign-in/    # Clerk auth pages
├── lib/
│   ├── db.ts                 # Neon PostgreSQL client
│   ├── clerk.ts              # API key generation
│   └── stripe.ts             # Stripe client + helpers
├── middleware.ts              # Clerk auth middleware
└── globals.css               # CSS variables + base styles
```

## TODO

- [ ] Real query UI for dashboard (filter by agent/session/time)
- [ ] Session detail view with reasoning chains
- [ ] Email notifications for error events
- [ ] Team collaboration (multiple API keys per account)
- [ ] Stripe subscription cancellation handling
- [ ] API key rotation UI
- [ ] Export audit logs to CSV/JSON
