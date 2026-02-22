import Link from "next/link";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Link2, BarChart2, Zap, Shield, MousePointerClick, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Shortening",
    description:
      "Shorten any long URL in seconds. Paste your link and get a clean, shareable short URL instantly.",
  },
  {
    icon: BarChart2,
    title: "Click Analytics",
    description:
      "Track every click on your links. See how many times your link was visited and monitor engagement over time.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Share your short links on social media, emails, or messages. They work seamlessly across all platforms.",
  },
  {
    icon: MousePointerClick,
    title: "Custom Aliases",
    description:
      "Create memorable, branded short links with custom aliases that reflect your content.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your links are stored securely and will always redirect correctly. Built for reliability you can count on.",
  },
  {
    icon: Link2,
    title: "Manage All Links",
    description:
      "View, manage, and organize all your shortened links from one simple dashboard.",
  },
];

const steps = [
  { step: "1", title: "Paste your URL", description: "Copy the long URL you want to shorten and paste it into the input field." },
  { step: "2", title: "Get your short link", description: "Click shorten and receive a compact, shareable link in an instant." },
  { step: "3", title: "Share & track", description: "Share your short link anywhere and watch the click analytics roll in." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Link2 className="h-4 w-4" />
          <span>Simple, fast link shortening</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          Shorten links.{" "}
          <span className="text-primary">Track clicks.</span>{" "}
          Share smarter.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Transform long, unwieldy URLs into clean short links — then watch your
          analytics grow. Free to use, no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base transition-colors hover:bg-primary/90">
                Get Started Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base transition-colors hover:bg-primary/90 inline-flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <Link
            href="#features"
            className="h-12 px-8 rounded-full border border-border font-semibold text-base transition-colors hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center"
          >
            See Features
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Powerful features packed into a simple, intuitive interface.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get started in three simple steps — no setup required.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {step}
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to shorten your first link?</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Join today and start creating short links that are easy to share and track.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base transition-colors hover:bg-primary/90">
                Create Free Account
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base transition-colors hover:bg-primary/90 inline-flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span className="font-semibold text-foreground">Link Shortener</span>
          </div>
          <p>© {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
