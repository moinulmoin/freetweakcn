import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { FREE_SUB_FEATURES } from "@/utils/subscription";
import { Check, Circle, Mail } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Testimonials } from "@/components/home/testimonials";

export const metadata: Metadata = {
  title: "Pricing — tweakcn",
  robots: "index, follow",
};

export default function PricingPage() {
  return (
    <div className="from-background via-background to-muted/20 relative isolate min-h-screen bg-gradient-to-br">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 right-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute bottom-0 left-0 size-80 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto space-y-28 px-4 py-20 md:px-6">
        {/* Header Section */}
        <section className="space-y-2 text-center">
          <h1 className="from-foreground to-foreground/50 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-pretty text-transparent md:text-6xl">
            Free for everyone
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base text-balance md:text-lg">
            Build beautiful themes with no strings attached.
          </p>
        </section>

        {/* Pricing Card */}
        <section className="mx-auto max-w-lg">
          <Card className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300">
            <CardHeader className="space-y-2 border-b">
              <div className="flex items-center gap-3">
                <CardTitle className="text-4xl font-medium">Free</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight lg:text-5xl">$0</span>
                <span className="text-muted-foreground text-lg"> forever</span>
              </div>
              <p className="text-muted-foreground text-sm">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {FREE_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 flex items-center justify-center rounded-full p-1">
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Circle className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className="text-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="h-12 w-full text-base font-medium transition-all duration-200"
                size="lg"
              >
                <Link href="/editor/theme">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        <div className="-mt-8">
          <Testimonials />
        </div>

        {/* FAQs Section */}
        <section className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              FAQs
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base text-balance md:text-lg">
              Here&apos;s everything you may want to know. For any other info, just{" "}
              <Link href="mailto:sahaj@tweakcn.com" className="text-primary hover:underline">
                reach us
              </Link>
              .
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {PRICING_FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-border/40 group border-b py-2"
              >
                <AccordionTrigger className="group-hover:text-primary text-left font-medium transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        {/* Bottom Section */}
        <div className="text-center">
          <div className="mx-auto max-w-2xl space-y-2">
            <p className="text-muted-foreground text-pretty">
              Need something custom or have questions?
            </p>
            <Link href="mailto:sahaj@tweakcn.com">
              <Button variant="link">
                <Mail className="size-4" />
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRICING_FAQS = [
  {
    question: "Is tweakcn really free?",
    answer: `Yes! tweakcn is completely free. You get full theme customization, access to preset themes, and up to ${AI_REQUEST_FREE_TIER_LIMIT} AI-generated themes per day. No credit card, no hidden fees.`,
  },
  {
    question: "What's the daily AI limit?",
    answer: `You can generate up to ${AI_REQUEST_FREE_TIER_LIMIT} themes per day with AI. The limit resets every day at midnight UTC, so you always get a fresh batch of requests.`,
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You need to sign in to use AI theme generation and to save your themes. Theme customization using the visual editor works without an account.",
  },
  {
    question: "What happens to my saved themes?",
    answer:
      "All your created themes are yours forever. You can save, share, and export them at any time.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security seriously. Your data is stored securely, and we never share your personal information with third parties.",
  },
];
