import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Link2, Zap, BarChart2, Shield, Globe, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create short links in seconds. Our optimized infrastructure ensures instant redirects for your audience worldwide.",
  },
  {
    icon: BarChart2,
    title: "Detailed Analytics",
    description:
      "Track clicks, geographic data, and referral sources with a real-time dashboard to understand your audience.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Every link is protected and monitored. Enjoy 99.9% uptime so your links are always working when you need them.",
  },
  {
    icon: Globe,
    title: "Custom Short Links",
    description:
      "Brand your links with memorable, human-readable slugs that reinforce your identity with every share.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Link2 className="h-4 w-4" />
            Shorten. Share. Track.
          </span>
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Short links that work{" "}
          <span className="text-primary/80">harder for you</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Transform long, unwieldy URLs into clean, trackable links in one
          click. Share confidently and measure what matters.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center rounded-full border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          Everything you need to manage links
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/10"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-muted-foreground">
            Join today and start shortening, sharing, and tracking your links.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Create your free account
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
      </section>
    </div>
  );
}
