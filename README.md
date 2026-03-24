# GreyBox MVP

Agents are black boxes. We fix that.

## Deployment

⚠️ **This app requires Vercel** because it uses server-side features:
- Clerk authentication (server-side)
- Stripe payments (server-side)
- Neon DB (server-side)
- API routes (server-side)

GitHub Pages cannot run Node.js apps.

### Quick Deploy to Vercel

**Option 1: GitHub Actions (automatic)**
1. Go to [vercel.com](https://vercel.com) → Account Settings → Tokens → Create token
2. Go to GitHub repo Settings → Secrets → Add:
   - `VERCEL_TOKEN`: your Vercel token
   - `VERCEL_ORG_ID`: from `vercel projects ls` or project settings
   - `VERCEL_PROJECT_ID`: from project settings
3. Push to master — workflow auto-deploys

**Option 2: Manual import**
1. Go to [vercel.com](https://vercel.com) → "Import Project"
2. Import `burninmedia/greybox-mvp`
3. Add environment variables from `.env.example`
4. Deploy
5. Configure custom domain `greybox.fyi` in project settings → Domains

### GitHub Pages (Static Landing Only)

The `.github/workflows/pages.yml` (if present) builds a static-only version.
The full product does NOT work on GitHub Pages.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your Clerk, Stripe, Neon keys
npm run dev
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk
- **Payments**: Stripe
- **Database**: Neon (Postgres)
- **Deployment**: Vercel
