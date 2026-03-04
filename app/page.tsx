import {
  Link2,
  Zap,
  BarChart3,
  Shield,
  Pencil,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate short links instantly. Our infrastructure ensures your redirects happen in milliseconds, every time.",
  },
  {
    icon: Pencil,
    title: "Custom Aliases",
    description:
      "Create memorable, branded short links with custom slugs that reflect your content and are easy to share.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track every click with detailed analytics. Understand your audience with real-time data on link performance.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "All links are protected and managed through your account. Your data stays private and always under your control.",
  },
];

const steps = [
  {
    step: "1",
    title: "Paste Your URL",
    description: "Drop any long URL into the input field on your dashboard.",
  },
  {
    step: "2",
    title: "Get a Short Link",
    description:
      "We instantly generate a compact, shareable link for you — optionally with a custom alias.",
  },
  {
    step: "3",
    title: "Share & Track",
    description:
      "Share the link anywhere and monitor click-through data in real time from your dashboard.",
  },
];

const benefits = [
  "Free to get started",
  "No credit card required",
  "Cancel anytime",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.4_0.15_264)_0%,transparent_100%)] opacity-40" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Link2 className="h-3.5 w-3.5" />
            Simple, fast link shortening
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Shorten Links.{" "}
            <span className="text-primary">Amplify Reach.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Transform long, unwieldy URLs into clean, trackable short links in
            seconds. Share smarter and measure what matters.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn More
              </a>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to make link management effortless and
              insightful.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 sm:py-28 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Get started in three simple steps — no setup required.
            </p>
          </div>
          <div className="relative grid gap-8 sm:grid-cols-3">
            {/* Connector line (desktop) */}
            <div className="absolute top-8 left-1/4 right-1/4 hidden h-px bg-border sm:block" />
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to shorten your first link?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join thousands of users who trust our platform to manage and track
              their links.
            </p>
            <ul className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center">
              {benefits.map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <div className="mt-8">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                    Create Your Free Account
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
