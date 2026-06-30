import Link from "next/link";
import Image from "next/image";
import { HelpCircle, ChevronRight, Star, User, MessageCircle, BarChart3, Settings, CreditCard } from "lucide-react";
import LandingFooter from "@/components/layout/LandingFooter";

function LandingNav() {
  return (
    <nav className="fixed top-0 w-full h-20 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_rgba(123,127,239,0.08)] z-50">
      <div className="flex justify-between items-center px-6 max-w-7xl mx-auto w-full h-full">
        <Link href="/" className="active:scale-95 transition-transform">
          <Image src="/logo.png" alt="PetalBird" width={72} height={72} className="object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-base text-on-surface-variant hover:text-primary transition-colors">Login</Link>
          <Link href="/discover" className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-6 py-2 rounded-full text-base font-semibold hover:scale-105 transition-transform duration-200 shadow-[0_4px_16px_rgba(123,127,239,0.2)]">
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

const categories = [
  {
    icon: User,
    label: "Getting Started",
    faqs: [
      {
        q: "How do I create a PetalBird account?",
        a: "Tap Join Now on the homepage and fill in your name, email, date of birth, and a password. You'll then be prompted to upload your first profile photo and complete a short style questionnaire so our algorithm can start curating your discovery feed.",
      },
      {
        q: "What makes a great PetalBird profile?",
        a: "High-quality, well-lit photos are the single biggest driver of a higher Style Score. We recommend uploading 3–6 varied photos — a clear face shot, a full-body look, and at least one candid. Profiles with complete bios receive 40% more views on average.",
      },
      {
        q: "Is PetalBird free to use?",
        a: "Yes. Core discovery, ratings, and messaging are free. PetalBird Premium ($9.99/month) unlocks advanced analytics, unlimited profile boosts, and priority placement in the discovery feed.",
      },
      {
        q: "What age do I need to be to join?",
        a: "PetalBird is for users 18 and older. We verify age during registration and any account found to belong to a minor is permanently removed.",
      },
    ],
  },
  {
    icon: Star,
    label: "Ratings & Scores",
    faqs: [
      {
        q: "How is my Style Score calculated?",
        a: "Your Style Score is a weighted average of all ratings you've received in the last 30 days, adjusted for rater credibility and activity level. Ratings from highly-active, verified accounts carry slightly more weight. Scores update every 24 hours.",
      },
      {
        q: "Can I see who rated me?",
        a: "Ratings are anonymous by default to encourage honest feedback. Premium users can see aggregate demographic data (e.g. age range, gender) of their raters, but not individual identities.",
      },
      {
        q: "What does 'Top 5% this week' mean?",
        a: "Your profile received more ratings — and higher average ratings — than 95% of active profiles on PetalBird in the last 7 days. This badge resets weekly.",
      },
      {
        q: "Why did my score drop suddenly?",
        a: "Score drops can happen if: (1) a set of high ratings aged out of the 30-day window, (2) you received several lower ratings recently, or (3) your photo set changed. Check the Score History chart on your profile for a breakdown.",
      },
    ],
  },
  {
    icon: MessageCircle,
    label: "Messaging",
    faqs: [
      {
        q: "Who can message me?",
        a: "By default, only users you've mutually rated (both gave each other a score of 7 or above) can start a conversation. You can adjust this in Settings → Privacy → Message Permissions.",
      },
      {
        q: "Are messages private?",
        a: "Yes. Messages are encrypted in transit and only visible to the sender and recipient. PetalBird staff cannot read your messages unless flagged by both parties in a safety report.",
      },
      {
        q: "How do I report or block someone?",
        a: "Open the conversation, tap the three-dot menu in the top right, and select 'Report' or 'Block'. Blocked users can't see your profile, rate you, or message you. We review all reports within 24 hours.",
      },
    ],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    faqs: [
      {
        q: "What analytics does PetalBird provide?",
        a: "Free accounts see their overall Style Score and a 7-day view count. Premium unlocks: 90-day score history, rater demographic breakdowns, photo-level performance data, peak viewing hours, and comparison to community averages.",
      },
      {
        q: "How often does my view count update?",
        a: "View counts update in real time. Analytics charts and demographic data refresh every 6 hours.",
      },
    ],
  },
  {
    icon: Settings,
    label: "Account & Privacy",
    faqs: [
      {
        q: "How do I change my email or password?",
        a: "Go to Settings → Account → Security. You'll need to verify your current email before making changes. If you've lost access, use the 'Forgot password' link on the login page.",
      },
      {
        q: "Can I make my profile private?",
        a: "Yes. Settings → Privacy → Profile Visibility lets you switch between Public (anyone on PetalBird), Members Only (logged-in users only), or Private (only people you approve).",
      },
      {
        q: "How do I delete my account?",
        a: "Settings → Account → Delete Account. Enter your password to confirm. Your profile is immediately hidden and all personal data is permanently deleted within 30 days. This cannot be undone.",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Premium & Billing",
    faqs: [
      {
        q: "What's included in PetalBird Premium?",
        a: "Premium ($9.99/month or $79.99/year) includes: advanced analytics, unlimited profile boosts, priority discovery placement, rater demographic data, and a Premium badge on your profile.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Settings → Account → Subscription → Cancel Premium. Your Premium features remain active until the end of the current billing period. We do not offer prorated refunds for partial months.",
      },
      {
        q: "Is my payment information secure?",
        a: "All billing is handled by Stripe, a PCI DSS Level 1 certified payment processor. PetalBird never stores your full card number on our servers.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#7B7FEF] opacity-5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      <LandingNav />

      <main className="flex-grow pt-20 relative z-10">
        {/* Hero */}
        <div className="w-full px-6 max-w-5xl mx-auto pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm mb-6">
            <HelpCircle size={16} className="text-[#7B7FEF]" />
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Help Center</span>
          </div>
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-on-surface leading-tight mb-4">
            How can we <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]">help?</span>
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto">
            Find answers to common questions about PetalBird. Can&apos;t find what you need? <Link href="/contact-us" className="text-[#7B7FEF] font-semibold hover:underline">Contact our team.</Link>
          </p>
        </div>

        {/* Category chips */}
        <div className="w-full px-6 max-w-5xl mx-auto mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(({ icon: Icon, label }) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full text-sm font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all">
                <Icon size={14} className="text-[#7B7FEF]" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ sections */}
        <div className="w-full px-6 max-w-5xl mx-auto pb-20 flex flex-col gap-10">
          {categories.map(({ icon: Icon, label, faqs }) => (
            <div key={label} id={label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#7B7FEF]" />
                </div>
                <h2 className="font-heading text-[22px] font-semibold text-on-surface">{label}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_4px_16px_rgba(123,127,239,0.05)] group hover:shadow-[0_8px_32px_rgba(123,127,239,0.08)] transition-shadow">
                    <div className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-[#7B7FEF] mt-[3px] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <div>
                        <p className="text-sm font-semibold text-on-surface mb-2">{q}</p>
                        <p className="text-sm leading-6 text-on-surface-variant">{a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <div className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] rounded-xl p-8 text-center text-white">
            <h3 className="font-heading text-[22px] font-semibold mb-2">Still need help?</h3>
            <p className="text-white/80 text-sm mb-6">Our support team typically replies within a few hours.</p>
            <Link href="/contact-us" className="inline-block bg-white text-[#7B7FEF] font-semibold px-8 py-3 rounded-full hover:scale-105 transition-transform duration-200">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
