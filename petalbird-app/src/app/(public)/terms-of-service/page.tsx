import Link from "next/link";
import Image from "next/image";
import { FileText, Users, Star, AlertTriangle, Gavel, RefreshCw } from "lucide-react";
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
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      "By creating a PetalBird account or using any part of our platform, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree with any part of these terms, you may not access the service.",
      "We may update these Terms at any time. Continued use of PetalBird after changes constitutes acceptance. We will notify you via email and in-app banner for material changes.",
      "These Terms apply to all users including visitors, registered members, and Premium subscribers.",
    ],
  },
  {
    icon: Users,
    title: "Account Eligibility & Registration",
    content: [
      "You must be at least 18 years old to create a PetalBird account. We do not knowingly collect data from users under 18.",
      "Each person may maintain only one active PetalBird account. Duplicate accounts are subject to immediate termination.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "You agree to provide accurate, current, and complete information during registration and to keep your profile updated.",
      "Accounts created with false information, bots, or scripts violate these Terms and will be permanently banned.",
    ],
  },
  {
    icon: Star,
    title: "Community Standards & Content Rules",
    content: [
      "**Authentic Content Only:** All photos must be genuine, unaltered representations of yourself. Heavy digital manipulation that misrepresents your appearance is prohibited.",
      "**Respectful Ratings:** Ratings must reflect genuine aesthetic appreciation. Coordinated mass low-rating campaigns (brigading) are a violation and subject to account termination.",
      "**No Harassment:** Sending unsolicited explicit messages, threats, or hate speech via PetalBird Messaging is strictly prohibited.",
      "**No Impersonation:** You may not create a profile pretending to be another person, celebrity, or public figure.",
      "**Age-Appropriate Content:** All uploaded content must comply with our Content Guidelines. Explicit or adult content is not permitted.",
      "PetalBird reserves the right to remove any content that violates these standards without prior notice.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content: [
      "Scraping, crawling, or programmatically accessing PetalBird data without written permission from PetalBird Inc.",
      "Using the platform to promote commercial services, run advertisements, or solicit other users.",
      "Attempting to reverse-engineer, decompile, or extract the source code of any PetalBird software.",
      "Interfering with or disrupting the integrity or performance of the service or its connected infrastructure.",
      "Circumventing or attempting to circumvent any rate limits, security measures, or access controls.",
      "Collecting or harvesting personal data of other users without their explicit consent.",
    ],
  },
  {
    icon: Gavel,
    title: "Intellectual Property",
    content: [
      "PetalBird and its logos, design system, and proprietary algorithms are the intellectual property of PetalBird Inc.",
      "By uploading content to PetalBird, you grant PetalBird a non-exclusive, worldwide, royalty-free licence to display and distribute your content on the platform.",
      "You retain full ownership of all content you upload. We will never sell your photos to third parties.",
      "If you believe any content on PetalBird infringes your copyright, please contact legal@petalbird.app with a DMCA takedown notice.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Termination & Disputes",
    content: [
      "You may delete your account at any time from Settings. We may terminate or suspend accounts that violate these Terms without prior notice.",
      "PetalBird is provided 'as is.' We make no warranties regarding uptime, accuracy of Style Scores, or fitness for a particular purpose.",
      "To the maximum extent permitted by law, PetalBird's liability is limited to the amount you paid us in the 12 months preceding any claim.",
      "These Terms are governed by the laws of the State of Delaware, USA. Any disputes shall be resolved through binding arbitration.",
      "For account disputes or appeals, contact support@petalbird.app. We aim to respond within 2 business days.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-[#7B7FEF] opacity-5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3 z-0" />

      <LandingNav />

      <main className="flex-grow pt-20 relative z-10">
        {/* Hero */}
        <div className="w-full px-6 max-w-4xl mx-auto pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-sm mb-6">
            <FileText size={16} className="text-[#7B7FEF]" />
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Effective: November 14, 2024</span>
          </div>
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-on-surface leading-tight mb-4">
            Terms of <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B7FEF] to-[#A78BFA]">Service</span>
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
            These terms govern your use of PetalBird. Please read them carefully before joining our community.
          </p>
        </div>

        {/* Quick nav */}
        <div className="w-full px-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-[0_8px_32px_rgba(123,127,239,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-4">On this page</p>
            <div className="flex flex-wrap gap-2">
              {sections.map(({ title }) => (
                <span key={title} className="text-xs px-3 py-1.5 bg-primary/10 text-[#7B7FEF] rounded-full font-semibold">{title}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="w-full px-6 max-w-4xl mx-auto pb-20 flex flex-col gap-6">
          {sections.map(({ icon: Icon, title, content }, idx) => (
            <div key={title} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-8 shadow-[0_8px_32px_rgba(123,127,239,0.06)]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B7FEF] to-[#A78BFA] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#7B7FEF]" />
                  </div>
                  <h2 className="font-heading text-[20px] font-semibold text-on-surface">{title}</h2>
                </div>
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

          <div className="bg-gradient-to-r from-[#7B7FEF]/10 to-[#A78BFA]/10 border border-[#7B7FEF]/20 rounded-xl p-8 text-center">
            <p className="text-sm text-on-surface-variant mb-2">Legal inquiries?</p>
            <a href="mailto:legal@petalbird.app" className="text-[#7B7FEF] font-semibold hover:underline">legal@petalbird.app</a>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
