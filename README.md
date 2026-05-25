# PayPack 💸
### Smart Group Payments for India

> Split bills instantly · Find the best cashback · Order green together

A full-stack payments app that solves 3 real problems Indians face every day with UPI and group spending.

---

## 🚀 Live Demo
**[paypack.vercel.app](https://paypack-pied.vercel.app/)**

---

## 🎯 The Problem

Indians do **50 billion UPI transactions a year**, yet:
- 📱 We still settle bills over WhatsApp text and spreadsheets
- 💸 We overpay because we don't know which card or app gives the best cashback
- 🚚 We get 5 separate deliveries from the same shop, wasting money and polluting the environment

**PayPack fixes all three.**

---

## ✨ Features

### 👥 Module 1 — Split & Settle
- Create groups for trips, dinners, flatmates
- Add expenses with custom splits (not just equal)
- Auto-calculate who owes who with debt simplification
- **One-tap UPI payment** via QR code or WhatsApp share
- Real-time balance updates

### ⚡ Module 2 — Pay Optimizer
- Enter any amount + spending category
- Get ranked recommendations for best UPI app or credit card
- Shows exact ₹ savings per method (e.g. "HDFC Millennia gives ₹92 back")
- Personalized — only shows methods you actually own
- Powered by 100+ real cashback offers from Indian banks and UPI apps

### 🌿 Module 3 — Green Group Buy
- See nearby group orders on a real map (OpenStreetMap)
- Join to consolidate deliveries — one truck instead of five
- Live CO₂ savings counter
- Create your own group order at your location
- Impact tracker: kg CO₂ saved, delivery charges split

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Maps | Leaflet.js + OpenStreetMap |
| Charts | Recharts |
| QR Code | qrcode.react |
| State | Zustand |
| Deploy | Vercel |

**Total infrastructure cost: ₹0** — fully built on free-tier and open-source tools.

---

## 📁 Project Structure

```
paypack/
├── app/
│   ├── (auth)/              # Clerk sign-in/sign-up pages
│   ├── (dashboard)/         # Protected routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── groups/          # Split & Settle module
│   │   ├── optimizer/       # Pay Optimizer module
│   │   ├── groupbuy/        # Green Group Buy module
│   │   └── profile/         # User preferences & payment methods
│   └── page.tsx             # Landing page
├── components/
│   ├── groups/              # Expense, balance, modal components
│   ├── groupbuy/            # Map view component
│   ├── optimizer/           # Results components
│   └── shared/              # Navbar, BottomNav, PageHeader
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── optimizer.ts         # Payment ranking logic
│   ├── co2.ts               # CO₂ calculation formulas
│   └── upi.ts               # UPI deeplink + WhatsApp generator
├── store/                   # Zustand state management
├── types/                   # TypeScript interfaces
└── supabase/
    └── seed.sql             # 100 cashback offers seed data
```

---

## 🗄️ Database Schema

```sql
users          -- Clerk user profiles + owned payment methods
groups         -- Bill splitting groups
expenses       -- Individual expenses with custom splits
offers         -- 100 cashback offers (UPI apps + credit cards)
group_orders   -- Green group buy orders with geo coordinates
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Clerk](https://clerk.com) account

### Installation

```bash
# Clone the repo
git clone https://github.com/Palak24Ol/paypack.git
cd paypack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Clerk keys

# Run the development server
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Database Setup

Run the SQL from `supabase/seed.sql` in your Supabase SQL Editor to create all tables and seed 100 cashback offers.

---

## 📊 Offers Dataset

The Pay Optimizer is powered by **100 manually researched cashback offers** covering:

| Source | Records |
|---|---|
| UPI Apps (PhonePe, GPay, Paytm, Amazon Pay, BHIM, CRED, MobiKwik) | 40 |
| Credit Cards (HDFC, Axis, ICICI, SBI, Flipkart, Tata Neu, IDFC, Slice) | 35 |
| UPI-linked Credit Cards (Kiwi, HDFC RuPay) | 15 |
| Debit & Wallet offers | 10 |

Categories: Food · Grocery · Shopping · Travel · Utility · Dining · Entertainment · Offline

---

## 🌿 CO₂ Impact Calculation

```
CO₂ saved = (number of solo deliveries consolidated - 1) × 0.4 kg
```

Based on average last-mile delivery emissions of **0.4 kg CO₂ per delivery** (CPCB India data).

---

## 🔮 Roadmap

- [ ] Real UPI payment integration (Razorpay/PayU)
- [ ] Bank statement import for automatic expense detection
- [ ] Recurring expense tracking for flatmates
- [ ] Offer alerts when better cashback becomes available
- [ ] Android/iOS app via React Native

---

## 👩‍💻 Built By

**Palak Jaiswal** — Full Stack Developer & UI/UX Designer

- Portfolio: [my-portfolio-dnx6.vercel.app](https://my-portfolio-dnx6.vercel.app)
- GitHub: [@Palak24Ol](https://github.com/Palak24Ol)

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

