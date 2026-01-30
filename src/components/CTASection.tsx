"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CTASection = () => {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Paste your job description below and get started. No credit card
            needed.
          </p>
          <textarea
            className="w-full min-h-32 p-4 rounded-md border border-border bg-background text-foreground mb-8 resize-y"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
          <Link href="/sign-in">
            <Button variant="hero" asChild>
              <span>
                Create free account
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
