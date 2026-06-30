import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  PlayCircle,
  Compass,
  BarChart3,
  Star,
  TrendingUp,
  Heart,
} from "lucide-react";
import LandingFooter from "@/components/layout/LandingFooter";

/* ─── Landing Topnav ───────────────────────────────────────────────────── */
function LandingNav() {
  return (
    <nav className="fixed top-0 w-full h-20 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_32px_rgba(123,127,239,0.08)] z-50">
      <div className="flex justify-between items-center px-6 max-w-7xl mx-auto w-full h-full">
        {/* Brand */}
        <Link href="/" className="active:scale-95 transition-transform">
          <Image
            src="/logo.png"
            alt="PetalBird"
            width={72}
            height={72}
            className="object-contain"
          />
        </Link>

        {/* Nav links – desktop */}
        <ul className="hidden md:flex items-center gap-5">
          {["Features", "About"].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase()}`}
                className="text-[20px] leading-7 font-semibold text-on-surface-variant hover:text-primary transition-colors active:scale-95"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:block text-base text-on-surface-variant hover:text-primary transition-colors active:scale-95"
          >
            Login
          </Link>
          <Link
            href="/discover"
            className="bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-[20px] font-semibold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_4px_16px_rgba(123,127,239,0.2)]"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero Section ─────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="w-full px-6 max-w-7xl mx-auto pt-8 md:pt-0 pb-12 md:pb-32 flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {/* Text content */}
      <div className="flex-1 flex flex-col items-center md:items-start gap-5 md:gap-8 z-10 text-center md:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm">
          <BadgeCheck size={18} className="text-[#7B7FEF]" />
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">
            Premium Social Discovery
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[30px] md:text-[48px] leading-[1.15] md:leading-[56px] tracking-[-0.02em] font-bold text-on-surface">
          Get Ratings On Your{" "}
          <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]">
            Appeal
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base leading-6 text-on-surface-variant max-w-lg">
          Step into a curated digital gallery where style meets discovery.
          Connect with an aspirational community, receive nuanced aesthetic
          feedback, and elevate your social presence.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto">
          <Link
            href="/discover"
            className="w-full sm:w-auto bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA] text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-[20px] font-semibold hover:scale-105 transition-transform duration-200 shadow-[0_8px_32px_rgba(123,127,239,0.25)] text-center"
          >
            Join Now
          </Link>
          <button className="w-full sm:w-auto bg-white border border-white/40 text-on-surface px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-[20px] font-semibold hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center gap-2">
            <PlayCircle size={18} />
            How it works
          </button>
        </div>
      </div>

      {/* Hero imagery */}
      <div className="flex-1 relative w-full h-[300px] sm:h-[400px] md:h-[600px] flex items-center justify-center">
        {/* Main image card (slightly rotated) */}
        <div className="absolute w-[80%] h-[90%] left-[10%] top-[5%] bg-surface-container-low rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.05)] border border-white/40 z-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
          <Image
            src="/hero_portrait.png"
            alt="Hero portrait"
            fill
            className="object-cover"
            priority
          />

          {/* Floating rating widget */}
          <div className="absolute bottom-6 right-6 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 flex items-center gap-4 shadow-[0_8px_32px_rgba(123,127,239,0.15)]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center text-white text-[20px] font-semibold">
              9.4
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] leading-7 font-semibold text-on-surface">
                Style Score
              </span>
              <span className="text-sm leading-5 text-on-surface-variant flex items-center gap-1">
                <TrendingUp size={14} className="text-success-green" />
                Top 5% this week
              </span>
            </div>
          </div>
        </div>

        {/* Secondary background card */}
        <div className="absolute w-[70%] h-[80%] right-0 bottom-0 bg-surface-container-highest rounded-xl overflow-hidden shadow-sm border border-white/40 z-0 rotate-[4deg] opacity-60">
          <Image
            src="/secondary_hero.png"
            alt="Secondary portrait"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Features Section ─────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section
      className="w-full px-4 md:px-6 max-w-7xl mx-auto py-10 md:py-24"
      id="features"
    >
      {/* Header */}
      <div className="text-center mb-8 md:mb-16">
        <h2 className="font-heading text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[-0.01em] font-semibold text-on-surface mb-4">
          Elevate Your Aesthetic
        </h2>
        <p className="text-base leading-6 text-on-surface-variant max-w-2xl mx-auto">
          Discover a new tier of social interaction driven by genuine visual
          appreciation and sophisticated analytics.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Feature 1 – Social Discovery (col-span-8) */}
        <div className="md:col-span-8 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-[0_8px_32px_rgba(123,127,239,0.06)] hover:shadow-[0_12px_48px_rgba(123,127,239,0.10)] transition-shadow duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A78BFA] opacity-5 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex-1 z-10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Compass size={28} className="text-primary" />
            </div>
            <h3 className="text-[20px] leading-7 font-semibold text-on-surface mb-3">
              Premium Social Discovery
            </h3>
            <p className="text-sm leading-5 text-on-surface-variant">
              Connect with tastemakers and style icons. Our algorithm curates
              high-quality profiles tailored to your aesthetic preferences,
              fostering a community of visual excellence.
            </p>
          </div>
          {/* Animated discovery grid visual */}
          <div className="flex-1 w-full h-48 bg-surface rounded-lg border border-white/40 relative overflow-hidden flex items-center justify-center z-10">
            <div className="grid grid-cols-3 gap-2 p-4 w-full h-full opacity-80">
              {[
                ["bg-surface-container-low", 0],
                ["bg-primary/10", 0.2],
                ["bg-surface-container-low", 0.4],
                ["bg-[#7B7FEF]/10", 0.1],
                ["bg-surface-container-low flex items-center justify-center", 0],
                ["bg-[#A78BFA]/10", 0.3],
              ].map(([cls, delay], i) => (
                <div
                  key={i}
                  className={`rounded-md h-full w-full animate-pulse ${cls}`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  {i === 4 && <Heart size={18} className="text-primary opacity-50" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2 – Analytics (col-span-4) */}
        <div className="md:col-span-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 md:p-8 flex flex-col shadow-[0_8px_32px_rgba(123,127,239,0.06)] hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <BarChart3 size={28} className="text-primary" />
          </div>
          <h3 className="text-[20px] leading-7 font-semibold text-on-surface mb-3">
            Profile Analytics
          </h3>
          <p className="text-sm leading-5 text-on-surface-variant mb-6 flex-grow">
            Track your appeal over time. Understand which looks resonate most
            with comprehensive demographic and stylistic breakdowns.
          </p>
          {/* Mini bar chart */}
          <div className="w-full h-24 flex items-end gap-2 px-2">
            <div className="w-1/5 bg-surface-container-high h-[40%] rounded-t-sm" />
            <div className="w-1/5 bg-surface-container-high h-[60%] rounded-t-sm" />
            <div className="w-1/5 bg-primary/40 h-[75%] rounded-t-sm" />
            <div className="w-1/5 bg-gradient-to-t from-[#7B7FEF] to-[#A78BFA] h-[95%] rounded-t-sm relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                Peak
              </div>
            </div>
            <div className="w-1/5 bg-surface-container-high h-[80%] rounded-t-sm" />
          </div>
        </div>

        {/* Feature 3 – Rating Scale (col-span-4) */}
        <div className="md:col-span-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 md:p-8 flex flex-col shadow-[0_8px_32px_rgba(123,127,239,0.06)] hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <Star size={28} className="text-primary" />
          </div>
          <h3 className="text-[20px] leading-7 font-semibold text-on-surface mb-3">
            1-10 Scale Visuals
          </h3>
          <p className="text-sm leading-5 text-on-surface-variant mb-6 flex-grow">
            Experience feedback through beautifully crafted, immersive rating
            sliders that make rating an engaging aesthetic experience.
          </p>
          {/* Slider visual */}
          <div className="w-full h-12 relative flex items-center mt-auto">
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="w-[75%] h-full bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]" />
            </div>
            <div className="absolute left-[75%] -translate-x-1/2 w-6 h-6 bg-white border-2 border-primary rounded-full shadow-md flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            <span className="absolute right-0 -bottom-6 text-xs font-bold tracking-[0.08em] uppercase text-primary">
              7.5 / 10
            </span>
          </div>
        </div>

        {/* Feature 4 – Gallery banner (col-span-8) */}
        <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.04)] group min-h-[220px]">
          <Image
            src="/gallery_banner.png"
            alt="Gallery banner"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent flex items-end p-8">
            <div>
              <h3 className="text-[20px] leading-7 font-semibold text-white mb-2">
                A Curated Gallery of You
              </h3>
              <p className="text-sm leading-5 text-white/80 max-w-md">
                Your profile is more than just photos; it&apos;s an editorial spread.
                Present yourself in the best light.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#7B7FEF] opacity-5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      <LandingNav />

      <main className="flex-grow pt-20 relative z-10">
        <HeroSection />
        <FeaturesSection />
      </main>

      <LandingFooter />
    </div>
  );
}
