"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function JobDescriptionForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    if (jobDescription.length < 30) return;

    setLoading(true);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription }),
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();

    // Store temporarily (simple approach)
    sessionStorage.setItem(
      "questions",
      JSON.stringify(data.questions)
    );

    router.push("/questions");
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="min-h-[160px]"
      />

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate Questions"}
      </Button>
    </div>
  );
}
