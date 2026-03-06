import {
  Link2,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Copy,
  MousePointerClick,
  Globe,
} from "lucide-react";
import { SignUpButton, SignInButton, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const features = [
  {
    icon: Link2,
    title: "Shorten Any URL",
    description:
      "Instantly transform long, unwieldy URLs into clean, shareable short links with a single click.",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description:
      "Monitor click counts and track how your links are performing over time with built-in analytics.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Redirects",
    description:
      "Our optimized infrastructure ensures your visitors are redirected in milliseconds, every time.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your links are protected with secure authentication. Only you can manage and delete your links.",
  },
  {
    icon: Globe,
    title: "Share Anywhere",
    description:
      "Share your short links on social media, emails, or anywhere else with confidence.",
  },
  {
    icon: Copy,
    title: "Easy to Manage",
    description:
      "Access all your shortened links in one dashboard. Copy, track, or delete them whenever you need.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste your long URL",
    description: "Copy your long URL and paste it into the input field on your dashboard.",
  },
  {
    number: "02",
    title: "Get your short link",
    description: "We instantly generate a unique, compact short link for you.",
  },
  {
    number: "03",
    title: "Share & track clicks",
    description: "Share your short link and watch the click count grow in real time.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.4_0.15_264)_0%,transparent_60%)] opacity-30" />
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <MousePointerClick className="h-4 w-4" />
              <span>Simple. Fast. Reliable.</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Shorten links.{" "}
              <span className="text-primary">Track results.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              Turn long, messy URLs into clean, powerful short links. Share
              them anywhere and watch your click analytics grow in real time.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Powerful features packed into a simple, easy-to-use interface.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Get your first short link in seconds — no complicated setup required.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-6 hidden h-px w-full -translate-x-1/2 bg-border sm:block" />
                )}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-lg font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to shorten your first link?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Sign up for free and start creating short links in seconds.
            </p>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Start for Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
