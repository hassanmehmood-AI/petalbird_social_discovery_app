import Link from "next/link";
import Image from "next/image";
import { Shield, Eye, Lock, Database, Bell, Trash2 } from "lucide-react";
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


const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "**Profile Data:** When you create a PetalBird account, we collect your name, email address, date of birth, and profile photos you choose to upload.",
      "**Usage Data:** We collect information about how you interact with the platform — pages viewed, profiles visited, ratings given, and time spent on features.",
      "**Device Information:** We may collect your IP address, browser type, operating system, and device identifiers to improve performance and security.",
      "**Communications:** If you use our messaging features, message content is encrypted in transit and stored securely on our servers.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To operate and personalise the PetalBird discovery experience, including surfacing profiles that match your aesthetic preferences.",
      "To calculate and display Style Scores, profile analytics, and trend data visible on your dashboard.",
      "To send you notifications about ratings you receive, new matches, and platform updates (controllable in Settings).",
      "To detect and prevent fraudulent activity, spam accounts, and violations of our community standards.",
      "To improve our recommendation algorithm and develop new features based on aggregated, anonymised usage patterns.",
    ],
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content: [
      "All data is encrypted at rest using AES-256 and in transit using TLS 1.3.",
      "We use role-based access controls so only authorised engineers can access production data, and all access is logged and audited.",
      "Photos uploaded to PetalBird are stored in geo-redundant, SOC 2 Type II certified cloud infrastructure.",
      "We conduct regular third-party security audits and penetration tests. Our last external audit was completed in October 2024.",
    ],
  },
  {
    icon: Shield,
    title: "Sharing Your Information",
    content: [
      "**We never sell your personal data.** Full stop.",
      "We share limited data with trusted service providers (cloud hosting, analytics, payment processors) under strict data processing agreements.",
      "We may disclose data if required by law, court order, or to protect the safety of our users and the public.",
      "Aggregate, anonymised statistics (e.g. platform-wide rating distributions) may be shared publicly or with research partners.",
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to keep you logged in and maintain your session preferences.",
      "Analytics cookies (opt-in) help us understand feature usage so we can improve the product.",
      "We do not use third-party advertising cookies or sell your browsing data to ad networks.",
      "You can manage cookie preferences at any time via Settings → Privacy → Cookie Preferences.",
    ],
  },
  {
    icon: Trash2,
    title: "Your Rights & Data Deletion",
    content: [
      "**Access:** You can export all your personal data at any time from Settings → Account → Export Data.",
      "**Correction:** Update your profile information directly from your profile page at any time.",
      "**Deletion:** Delete your account permanently from Settings → Account → Delete Account. All personal data is purged within 30 days.",
      "**Portability:** Download your ratings history, analytics, and profile data in JSON or CSV format.",
      "If you are in the EEA or UK, you have additional rights under GDPR. Contact privacy@petalbird.app to exercise them.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#7B7FEF] opacity-5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      <LandingNav />

      <main className="flex-grow pt-20 relative z-10">
        {/* Hero */}
        <div className="w-full px-6 max-w-4xl mx-auto pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm mb-6">
            <Shield size={16} className="text-[#7B7FEF]" />
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Last updated: November 14, 2024</span>
          </div>
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-on-surface leading-tight mb-4">
            Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]">Policy</span>
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains what data PetalBird collects, why we collect it, and how you stay in control.
          </p>
        </div>

        {/* Sections */}
        <div className="w-full px-6 max-w-4xl mx-auto pb-20 flex flex-col gap-6">
          {sections.map(({ icon: Icon, title, content }) => (
            <div key={title} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-8 shadow-[0_8px_32px_rgba(123,127,239,0.06)]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#7B7FEF]" />
                </div>
                <h2 className="font-heading text-[20px] font-semibold text-on-surface">{title}</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {content.map((item, i) => (
                  <li key={i} className="text-sm leading-6 text-on-surface-variant flex gap-2">
                    <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#7B7FEF] flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong class='text-on-surface font-semibold'>$1</strong>") }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact note */}
          <div className="bg-gradient-to-r from-[#7B7FEF]/10 to-[#A78BFA]/10 border border-[#7B7FEF]/20 rounded-xl p-8 text-center">
            <p className="text-sm text-on-surface-variant mb-2">Questions about this policy?</p>
            <a href="mailto:privacy@petalbird.app" className="text-[#7B7FEF] font-semibold hover:underline">privacy@petalbird.app</a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
