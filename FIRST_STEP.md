# PetalBird — Build Plan

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Pages, routing, server & client components, API routes |
| **Language** | TypeScript | Type safety across the whole project |
| **Styling** | Tailwind CSS v4 | Direct carry-over of your existing HTML tokens; glassmorphism utilities built-in |
| **Icons** | `lucide-react` | Replaces Material Symbols — tree-shakeable, React-native |
| **Fonts** | `next/font/google` | Inter + Montserrat loaded optimally, no layout shift |
| **Components** | shadcn/ui | Unstyled Radix primitives you fully own and style to PetalBird tokens |
| **State** | React `useState` / `useContext` | Local UI state (modals, tabs, rating hover); no global state lib needed yet |
| **Mock data** | TypeScript `const` files | Static arrays that look like real API responses; swap for Supabase later |
| **Database** | Supabase (PostgreSQL) | Added in Phase 5 — auth, data, real-time, storage |
| **Backend** | Next.js Server Actions + API Routes | No separate Express server needed |
| **Real-time** | Supabase Realtime | WebSocket channels for the messages feature |

> **Frontend-first strategy:** All phases 1–4 use hardcoded mock data. The UI is fully built and pixel-perfect before a single database call is written. Phase 5 wires everything to Supabase.

---

## Your Pages

| HTML Source | Next.js Route | Type |
|---|---|---|
| `desktop/landing_page_petalbird/code.html` | `app/(public)/page.tsx` | Static / marketing |
| `desktop/login_petalbird/code.html` | `app/(public)/login/page.tsx` | Auth form |
| `desktop/discover_feed_petalbird/code.html` | `app/(app)/discover/page.tsx` | Core feed |
| `desktop/user_profile_petalbird/code.html` | `app/(app)/profile/[username]/page.tsx` | Dynamic profile |
| `desktop/messages_petalbird/code.html` | `app/(app)/messages/[[...id]]/page.tsx` | Real-time chat |
| `mobile/*` | Same routes — responsive CSS | No separate mobile routes |

---

---

## Phase 1 — Project Scaffold & Design System

**Goal:** Runnable Next.js app with PetalBird tokens, fonts, and shared utilities in place. No pages converted yet.

### Steps

**1.1 — Create the app**
```bash
npx create-next-app@latest petalbird-app --typescript --tailwind --eslint --app --src-dir
cd petalbird-app
```

**1.2 — Install dependencies**
```bash
# shadcn/ui
npx shadcn@latest init

# Core packages
npm install lucide-react clsx tailwind-merge

# (Supabase — install now, wire up later in Phase 5)
npm install @supabase/supabase-js @supabase/ssr
```

**1.3 — Configure Tailwind with PetalBird tokens**

Replace `tailwind.config.ts` content with all color tokens from your HTML files. The key tokens to port:

```ts
// tailwind.config.ts
colors: {
  primary:                  '#0058bc',
  'primary-container':      '#0070eb',
  'on-primary':             '#ffffff',
  secondary:                '#006685',
  'secondary-container':    '#00c4fd',
  surface:                  '#f9f9f9',
  'surface-container':      '#eeeeee',
  'surface-container-low':  '#f3f3f3',
  'surface-container-high': '#e8e8e8',
  'on-surface':             '#1a1c1c',
  'on-surface-variant':     '#414755',
  outline:                  '#717786',
  'outline-variant':        '#c1c6d7',
  'deep-onyx':              '#111111',
  'glass-border':           'rgba(255,255,255,0.4)',
  'accent-gradient-start':  '#007AFF',
  'accent-gradient-end':    '#00C6FF',
  'success-green':          '#22c55e',
  error:                    '#ba1a1a',
}
```

**1.4 — Add global CSS utilities**

In `src/app/globals.css` add reusable classes used across all pages:

```css
@layer components {
  .card-glass {
    @apply bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_4px_24px_rgba(0,122,255,0.08)];
  }
  .btn-primary {
    @apply bg-gradient-to-r from-[#007AFF] to-[#00C6FF] text-white font-semibold rounded-xl px-6 py-3 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(0,122,255,0.3)];
  }
  .btn-outline {
    @apply bg-white border border-primary/20 text-primary font-semibold rounded-xl px-6 py-3 hover:bg-primary/5 transition-all;
  }
}
```

**1.5 — Set up fonts**

```tsx
// src/app/layout.tsx
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['600', '700'] })
```

**1.6 — Create route groups**

```
src/app/
├── (public)/           ← no sidebar/topbar (landing, login)
│   ├── layout.tsx
│   ├── page.tsx
│   └── login/
│       └── page.tsx
└── (app)/              ← has sidebar + topbar (authed pages)
    ├── layout.tsx
    ├── discover/
    ├── profile/[username]/
    └── messages/[[...id]]/
```

**Checkpoint:** `npm run dev` → blank page with correct background color `#f9f9f9` and no errors.

---

## Phase 2 — Shared Layout & Navigation Components

**Goal:** Build the shell that wraps all app pages — sidebar, topbar, and mobile nav — before any page content is converted.

### Components to build

**2.1 — Desktop Sidebar** (`src/components/layout/Sidebar.tsx`)
- 64px wide, fixed left, full height
- Icons: Home, Compass, MessageSquare, User, Settings (lucide-react)
- Active state uses gradient icon color
- Glassmorphism card style: `card-glass`

**2.2 — Top Bar** (`src/components/layout/TopBar.tsx`)
- 80px height, fixed top, blur background
- Logo left, search bar center, notifications + avatar right
- Search: pill shape, 48px height, `surface-container-low` fill

**2.3 — App Layout** (`src/app/(app)/layout.tsx`)
- Composes Sidebar + TopBar
- Main content area: `ml-16 pt-20` to clear fixed elements

**2.4 — Mobile Bottom Nav** (`src/components/layout/MobileNav.tsx`)
- Fixed bottom, shown only on `md:hidden`
- 5 icon tabs matching desktop sidebar items

**Checkpoint:** Navigate between `/discover`, `/profile/demo`, `/messages` — shell renders correctly on both desktop and mobile viewport.

---

## Phase 3 — Public Pages (Landing + Login)

**Goal:** Convert the two public-facing pages to pixel-perfect React components. No auth wiring — forms are UI only.

### 3.1 — Landing Page (`app/(public)/page.tsx`)

Sections to convert from `desktop/landing_page_petalbird/code.html`:
- **Hero:** Headline (Montserrat 700), subtitle, two CTA buttons (`btn-primary` + `btn-outline`), hero image/mockup
- **Features section:** 3-column grid of feature cards (`card-glass`)
- **Social proof / leaderboard widget:** Top-rated user rows with avatar + score badge
- **CTA banner:** Gradient background, signup prompt
- **Footer:** Links, logo

### 3.2 — Login Page (`app/(public)/login/page.tsx`)

Convert from `desktop/login_petalbird/code.html`:
- Centered card (`card-glass`), max-width 440px
- Logo + tagline at top
- Email + password inputs (shadcn `Input`)
- `btn-primary` submit button (full width)
- Google OAuth button (outline style)
- Toggle link: "Don't have an account? Sign up"
- Background: soft radial gradient blobs at corners (15% opacity)

**Note:** On form submit, `console.log()` the values for now. Auth is wired in Phase 5.

**Checkpoint:** Visit `/` and `/login` — visually matches `screen.png` references. Responsive on mobile viewport.

---

## Phase 4 — Core App Pages

**Goal:** Convert the three authenticated pages using mock data. All interactivity (tabs, rating hover, message input) works — just no real data yet.

### 4.1 — Mock Data Layer

Create `src/lib/mock-data.ts`:

```ts
export const mockPosts = [
  {
    id: '1',
    user: { username: 'sophia_m', avatar: '/avatars/1.jpg', displayName: 'Sophia M.' },
    image: '/posts/1.jpg',
    caption: 'Golden hour vibes ✨',
    avgRating: 4.7,
    ratingCount: 128,
    myRating: null,
  },
  // ... 5–8 more entries
]

export const mockProfile = {
  username: 'sophia_m',
  displayName: 'Sophia M.',
  bio: 'Visual storyteller · NYC',
  avatar: '/avatars/1.jpg',
  followers: 2400,
  following: 310,
  avgRating: 4.8,
  posts: mockPosts.slice(0, 6),
}

export const mockConversations = [
  {
    id: 'c1',
    with: { username: 'alex_k', displayName: 'Alex K.', avatar: '/avatars/2.jpg' },
    lastMessage: 'Love your latest post!',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'alex_k', content: 'Love your latest post!', time: '10:42 AM' },
      { id: 'm2', senderId: 'me', content: 'Thank you! 🙏', time: '10:45 AM' },
    ],
  },
]
```

---

### 4.2 — Discover Feed (`app/(app)/discover/page.tsx`)

Convert from `desktop/discover_feed_petalbird/code.html`:

**Layout:** 8-col main feed + 4-col right sidebar (12-col grid)

**Feed components:**
- `PostCard.tsx` — image, user info, caption, rating widget
- `RatingWidget.tsx` — 5-star interactive row
  - Hover: stars fill left-to-right with gradient color
  - Rated state: shows filled stars + "You rated X★"
  - Uses local `useState` for hover/selected; swapped for Supabase in Phase 5

**Right sidebar components:**
- `LeaderboardWidget.tsx` — top-rated users list with rank badge
- `TrendingWidget.tsx` — trending tags or posts grid

**Feed behaviour (mock):**
- Render `mockPosts` array as a vertical stack of `PostCard`
- Rating interaction updates local state only (no API call yet)

---

### 4.3 — User Profile (`app/(app)/profile/[username]/page.tsx`)

Convert from `desktop/user_profile_petalbird/code.html`:

**Sections:**
- **Profile header:** Cover image area, circular avatar, display name, username, bio, stats (followers / following / avg rating badge)
- **Action buttons:** "Follow" + "Message" (link to `/messages?user=username`)
- **Tabs:** Posts | Rated | About — use shadcn `Tabs` component
- **Posts grid:** 3-column masonry-style image grid, each card shows avg rating on hover overlay

**Data:** Read `username` from `params`, look up in `mockProfile`. Return a generic placeholder if not found.

---

### 4.4 — Messages (`app/(app)/messages/[[...id]]/page.tsx`)

Convert from `desktop/messages_petalbird/code.html`:

**Layout:** Two-panel split
- **Left panel (300px):** Conversation list — avatar, name, last message preview, unread badge
- **Right panel (flex-1):** Message thread + input bar

**Components:**
- `ConversationList.tsx` — renders `mockConversations`
- `MessageThread.tsx` — renders message bubbles; sent = right-aligned gradient, received = left-aligned `card-glass`
- `MessageInput.tsx` — pill input + send button; `onSubmit` appends to local state array

**Mobile behaviour:**
- Conversation list shown when no `id` param
- Message thread shown when `id` param present
- Back arrow navigates back to list

**Checkpoint:** All 5 pages match `screen.png` visually. Interactive elements (rating hover, tab switch, message send) respond correctly with mock data. No TypeScript errors (`npm run build` passes).

---

## Phase 5 — Backend & Database (Supabase)

> Start this phase only after the entire frontend is complete and visually signed off.

### 5.1 — Supabase Project Setup

1. Create project at supabase.com → copy URL + anon key
2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

3. Create `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server components)

### 5.2 — Database Schema

Run in Supabase SQL Editor:

```sql
-- Auto-create profile on signup
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz default now()
);

create table ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  rater_id uuid references profiles(id) on delete cascade,
  score smallint check (score between 1 and 5),
  created_at timestamptz default now(),
  unique(post_id, rater_id)  -- one rating per user per post
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

create table conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
```

### 5.3 — Wire Up Auth (Login Page)

Replace `console.log` in the login form with:
```ts
const { error } = await supabase.auth.signInWithPassword({ email, password })
```

Add `src/middleware.ts` to protect `(app)` routes — redirect to `/login` if no session.

### 5.4 — Replace Mock Data

| Mock | Real |
|---|---|
| `mockPosts` | `supabase.from('posts').select('*, profiles(*), ratings(*)')` |
| Rating local state | `supabase.from('ratings').upsert(...)` |
| `mockProfile` | `supabase.from('profiles').select('*').eq('username', username)` |
| `mockConversations` | Query via `conversation_participants` join |
| Local message append | Supabase Realtime `postgres_changes` subscription |

### 5.5 — File Uploads (Post Images / Avatars)

```ts
const { data } = await supabase.storage
  .from('post-images')
  .upload(`${userId}/${Date.now()}.jpg`, file)
```

Enable the `post-images` and `avatars` buckets in Supabase Storage with public read access.

---

## File Structure Target

```
petalbird-app/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    ← landing
│   │   │   └── login/page.tsx
│   │   └── (app)/
│   │       ├── layout.tsx                  ← sidebar + topbar shell
│   │       ├── discover/page.tsx
│   │       ├── profile/[username]/page.tsx
│   │       └── messages/[[...id]]/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── feed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── RatingWidget.tsx
│   │   │   ├── LeaderboardWidget.tsx
│   │   │   └── TrendingWidget.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   └── PostsGrid.tsx
│   │   └── messages/
│   │       ├── ConversationList.tsx
│   │       ├── MessageThread.tsx
│   │       └── MessageInput.tsx
│   ├── lib/
│   │   ├── mock-data.ts                    ← removed in Phase 5
│   │   ├── utils.ts                        ← cn() helper
│   │   └── supabase/
│   │       ├── client.ts                   ← browser client
│   │       └── server.ts                   ← server component client
│   └── types/
│       └── index.ts                        ← Post, Profile, Message types
├── public/
│   ├── avatars/                            ← placeholder images for mock data
│   └── posts/
├── .env.local
└── tailwind.config.ts
```

---

## Phase Summary

| Phase | What gets built | Data source | Done when |
|---|---|---|---|
| **1** | Scaffold, tokens, fonts, route groups | — | `npm run dev` loads, correct bg color |
| **2** | Sidebar, TopBar, MobileNav | — | Shell renders on all routes |
| **3** | Landing page, Login page | Static JSX | Matches `screen.png` |
| **4** | Discover, Profile, Messages | Mock TS data | All interactions work, `npm run build` passes |
| **5** | Supabase auth + DB + real-time | Supabase | App works end-to-end with real users |
