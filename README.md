# eventundo.in — ഇവന്റ് ഉണ്ടോ?

A hyper-local, community-driven event directory for Kerala. Discover upcoming festivals, tech meetups, sports events, exhibitions and more — one page, zero bloat.

Live at **[eventundo.in](https://eventundo.in)**

---

## What it does

- **Public feed** — browse approved upcoming events filtered by district and category
- **Calendar view** — monthly grid with Malayalam month names (Kollavarsham), event chips, and Google Calendar export
- **Archive** — past events preserved at `/archive`
- **Submit** — anyone can suggest an event; goes into a pending queue
- **Admin dashboard** — approve, reject, edit, or delete submissions at `/admin`
- **Share** — WhatsApp share and copy registration link on every card

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Styling | Tailwind CSS v4 (CSS-based config, custom dark mode variant) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password, admin-only) |
| Fonts | Inter via `next/font` |
| Toasts | Sonner |

## Project structure

```
app/
  page.tsx          # Homepage — event feed + calendar view
  archive/          # Past events
  submit/           # Public event submission form
  events/[id]/      # Individual event detail page
  admin/            # Admin dashboard (auth-protected)
    login/          # Admin login page
components/
  Header.tsx        # Sticky header with nav, clock, theme toggle
  EventCard.tsx     # Event card with share, maps, calendar actions
  EventFilters.tsx  # District + category filter dropdowns
  CalendarView.tsx  # Google Calendar-style monthly grid
  AdminDashboard.tsx
  SubmitForm.tsx
  ShareButton.tsx
  ThemeToggle.tsx
  LiveClock.tsx
  SkeletonCard.tsx
lib/
  supabase/         # client.ts + server.ts
  constants.ts      # Kerala districts + event categories
  types.ts          # Generated Supabase types
```

## Database schema

```sql
create table events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  category         text,
  event_date       date not null,
  venue            text not null,
  district         text not null,
  maps_url         text,
  registration_url text,
  status           text default 'pending',  -- 'pending' | 'approved'
  created_at       timestamptz default now()
);
```

RLS policies:
- **Public** — read approved events only
- **Authenticated (admin)** — read all, insert, update, delete

## Local development

**1. Clone and install**

```bash
git clone https://github.com/your-org/eventundo.in
cd eventundo.in
npm install
```

**2. Set environment variables**

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**3. Run dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**4. Admin access**

Create a user in Supabase Auth (email/password), then log in at `/admin/login`.

## Branches

| Branch | Description |
|---|---|
| `main` | Production-ready code |
| `ui/minimal` | Current minimal UI (appundo.in-inspired palette) |
| `ui/neo-brutalism` | Experimental neo-brutalism UI |

## License

MIT — built with ❤️ for Kerala.
