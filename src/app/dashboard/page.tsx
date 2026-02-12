"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Globe, 
  Clock, 
  ArrowRight,
  Zap,
  Lightbulb,
  Code2,
  Server,
  Database,
  Cloud
} from "lucide-react";
import { isLikelyIT } from "@/lib/isITJobDescription";

// Mock data
const MOCK_STATS = {
  questionsGenerated: 47,
  questionsSaved: 12,
  publicQuestions: 8,
};

const MOCK_RECENT_SETS = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    date: "2 days ago",
    questionCount: 15,
    saved: true,
  },
  {
    id: 2,
    jobTitle: "Full Stack Engineer - React/Node",
    date: "5 days ago",
    questionCount: 20,
    saved: true,
  },
  {
    id: 3,
    jobTitle: "DevOps Engineer",
    date: "1 week ago",
    questionCount: 12,
    saved: false,
  },
];

const JOB_TEMPLATES = [
  {
    title: "Frontend Developer",
    icon: Code2,
    description: "We're looking for a Frontend Developer skilled in React, TypeScript, and modern CSS. Experience with Next.js, state management (Redux/Zustand), and responsive design required. You'll build scalable web applications.",
  },
  {
    title: "Backend Developer",
    icon: Server,
    description: "Seeking a Backend Developer with expertise in Node.js, Express, and RESTful APIs. Experience with PostgreSQL, authentication systems, and microservices architecture. Focus on scalable server-side solutions.",
  },
  {
    title: "Full Stack Engineer",
    icon: Database,
    description: "Full Stack Engineer role requiring proficiency in React, Node.js, and TypeScript. Work on both frontend and backend, implementing features end-to-end. Experience with databases and cloud platforms essential.",
  },
  {
    title: "DevOps Engineer",
    icon: Cloud,
    description: "DevOps Engineer position requiring experience with Docker, Kubernetes, CI/CD pipelines, and AWS/Azure. Automate deployment processes and maintain cloud infrastructure. Strong scripting skills needed.",
  },
];

const TIPS = [
  "Make questions public to help the community",
  "Review explanations carefully after answering",
  "Generate role-specific questions for better practice",
  "Save important question sets for future reference",
];

const Dashboard = () => {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveQuestions, setSaveQuestions] = useState(false);

  const handleTemplateClick = (template: string) => {
    setJobDescription(template);
    setError("");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🔵 Generate button clicked");
    console.log("🔵 Job description length:", jobDescription.length);

    if (jobDescription.length < 30) {
      setError("Job description must be at least 30 characters");
      return;
    }

    if (!isLikelyIT(jobDescription)) {
      setError(
        "This doesn't appear to be an IT/Software Engineering role. Please provide a tech-related job description.",
      );
      return;
    }

    console.log("🔵 Validation passed, storing in sessionStorage");
    
    // Store job description and navigate immediately
    sessionStorage.setItem("pendingJobDescription", jobDescription);
    sessionStorage.setItem("saveQuestions", saveQuestions.toString());
    sessionStorage.setItem("isGenerating", "true");
    sessionStorage.removeItem("questions"); // Clear previous questions
    
    console.log("🔵 SessionStorage set:");
    console.log("  - pendingJobDescription:", sessionStorage.getItem("pendingJobDescription")?.substring(0, 50));
    console.log("  - isGenerating:", sessionStorage.getItem("isGenerating"));
    console.log("  - saveQuestions:", sessionStorage.getItem("saveQuestions"));
    
    console.log("🔵 Navigating to /questions");
    router.push("/questions");
    console.log("🔵 router.push called");
  };

  const progressPercentage = (MOCK_STATS.questionsGenerated / 100) * 100;

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-5xl mx-auto px-4 py-8 pt-24 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Questions Generated */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Questions Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {MOCK_STATS.questionsGenerated}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Questions Saved */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Questions Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <span className="text-3xl font-bold text-foreground">
                  {MOCK_STATS.questionsSaved}
                </span>
                <p className="text-xs text-muted-foreground">
                  Saved for 30 days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Public Questions */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Public Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <span className="text-3xl font-bold text-foreground">
                  {MOCK_STATS.publicQuestions}
                </span>
                <p className="text-xs text-muted-foreground">
                  Shared with community
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Generator */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Interview Questions
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Paste an IT/Software Engineering job description to generate tailored interview questions
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  {isLoading ? "Generating..." : "Generate Questions"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Start Templates */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Start Templates
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Use pre-made job descriptions to generate questions instantly
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {JOB_TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.title}
                    onClick={() => handleTemplateClick(template.description)}
                    className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">
                          {template.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Question Sets */}
          <Card className="border border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Question Sets
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Quick access to your recently generated questions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_RECENT_SETS.map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {set.jobTitle}
                        </h3>
                        {set.saved && (
                          <Badge variant="secondary" className="text-xs">
                            Saved
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{set.date}</span>
                        <span>•</span>
                        <span>{set.questionCount} questions</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips & Best Practices */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
