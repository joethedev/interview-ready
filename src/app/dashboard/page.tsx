"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Target,
  Brain,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { isLikelyIT } from "@/lib/isITJobDescription";

// Fake data
const stats = [
  { label: "Mock Interviews", value: 12, icon: Play, change: "+3 this week" },
  {
    label: "Average Score",
    value: "78%",
    icon: TrendingUp,
    change: "+5% improvement",
  },
  {
    label: "Questions Practiced",
    value: 156,
    icon: Brain,
    change: "24 this week",
  },
  { label: "Weak Areas", value: 4, icon: AlertTriangle, change: "2 improved" },
];

const recentSessions = [
  {
    id: 1,
    name: "Frontend Interview #3",
    date: "Jan 25, 2026",
    score: 85,
    status: "Completed",
  },
  {
    id: 2,
    name: "System Design Practice",
    date: "Jan 24, 2026",
    score: 72,
    status: "Completed",
  },
  {
    id: 3,
    name: "Behavioral Questions",
    date: "Jan 23, 2026",
    score: null,
    status: "In Progress",
  },
  {
    id: 4,
    name: "React Hooks Deep Dive",
    date: "Jan 22, 2026",
    score: 90,
    status: "Completed",
  },
];

const weakAreas = [
  { skill: "System Design", progress: 45 },
  { skill: "React Hooks", progress: 62 },
  { skill: "TypeScript Generics", progress: 38 },
  { skill: "State Management", progress: 55 },
];

const Dashboard = () => {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveQuestions, setSaveQuestions] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jobDescription.length < 30) {
      setError("Job description must be at least 30 characters");
      return;
    }

    // Check if it's IT-related
    if (!isLikelyIT(jobDescription)) {
      setError(
        "This doesn't appear to be an IT/Software Engineering role. Please provide a tech-related job description.",
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, saveQuestions }),
      });

      const data = await response.json();

      // Check for errors before navigating
      if (!response.ok || data.error) {
        if (data.error === "NOT_IT_ROLE") {
          setError(
            "This doesn't appear to be an IT/Software Engineering role. Please provide a tech-related job description.",
          );
        } else {
          setError("Failed to generate questions. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Only navigate if we have valid questions
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        sessionStorage.setItem("questions", JSON.stringify(data.questions));
        router.push("/questions");
      } else {
        setError("No questions were generated. Please try again.");
      }
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your interview practice and progress
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Question Generator */}
        <section>
          <Card className="border border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Generate Interview Questions
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Paste an IT/Software Engineering job description to generate
                tailored interview questions
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label
                    htmlFor="jobDescription"
                    className="block text-sm font-medium mb-2"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the IT/Software job description here... (minimum 30 characters)"
                    className="w-full h-48 px-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    disabled={isLoading}
                  />
                  {error && (
                    <div className="mt-2 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveQuestions"
                    checked={saveQuestions}
                    onChange={(e) => setSaveQuestions(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                  />
                  <label
                    htmlFor="saveQuestions"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Save questions for 30 days
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || jobDescription.length < 30}
                  className="w-full sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isLoading ? "Generating..." : "Generate Questions"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Stats Overview */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="border border-border shadow-card"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-accent p-2">
                      <stat.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Sessions */}
          <section className="lg:col-span-2">
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {session.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {session.score !== null && (
                          <span className="text-sm font-medium text-foreground">
                            {session.score}%
                          </span>
                        )}
                        <Badge
                          variant={
                            session.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                          className="whitespace-nowrap"
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Weak Areas */}
          <section>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {weakAreas.map((area) => (
                  <div key={area.skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {area.skill}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {area.progress}%
                      </span>
                    </div>
                    <Progress value={area.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
