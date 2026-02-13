"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CTASection = () => {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to ace your next interview?
            </h2>
            <p className="text-gray-300 text-lg">
              Paste your job description below and get started. No credit card needed.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
            <textarea
              className="w-full min-h-40 p-5 rounded-xl border border-gray-700/50 bg-gray-950/50 text-white placeholder:text-gray-500 mb-6 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-sm"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <div className="text-center">
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300 font-semibold">
                  Create free account
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
