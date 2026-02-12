"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionList from "@/components/questions/QuestionList";
import QuestionSkeleton from "@/components/questions/QuestionSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  Download,
  Share2,
  RotateCcw,
  Filter,
  TrendingUp,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [startTime] = useState(new Date());

  // Mock progress data - in real app, track from QuestionCard interactions
  const [progress] = useState({
    completed: 8,
    correct: 6,
    incorrect: 2,
  });

  useEffect(() => {
    const loadQuestions = async () => {
      console.log("🟢 Questions page mounted");
      console.log("🟢 SessionStorage contents:");
      console.log("  - isGenerating:", sessionStorage.getItem("isGenerating"));
      console.log("  - pendingJobDescription:", sessionStorage.getItem("pendingJobDescription")?.substring(0, 50));
      
      // Check if we're generating new questions
      const isGenerating = sessionStorage.getItem("isGenerating");
      
      if (isGenerating === "true") {
        // Generate new questions
        const jobDescription = sessionStorage.getItem("pendingJobDescription");
        const saveQuestions = sessionStorage.getItem("saveQuestions") === "true";
        
        if (!jobDescription) {
          setError("No job description found");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch("/api/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription, saveQuestions }),
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            if (data.error === "NOT_IT_ROLE") {
              setError(
                "This doesn't appear to be an IT/Software Engineering role. Please provide a tech-related job description."
              );
            } else {
              setError("Failed to generate questions. Please try again.");
            }
            setIsLoading(false);
            return;
          }

          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            sessionStorage.setItem("questions", JSON.stringify(data.questions));
            if (data.saved && data.questionSetId) {
              sessionStorage.setItem("questionSetId", data.questionSetId);
              sessionStorage.setItem("questionsSaved", "true");
            }
            setQuestions(data.questions);
          } else {
            setError("No questions were generated. Please try again.");
          }
        } catch (err) {
          setError("Failed to generate questions. Please try again.");
        } finally {
          // Clean up session storage
          sessionStorage.removeItem("isGenerating");
          sessionStorage.removeItem("pendingJobDescription");
          setIsLoading(false);
        }
      } else {
        // Load existing questions
        const stored = sessionStorage.getItem("questions");
        if (stored) {
          setQuestions(JSON.parse(stored));
        }
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const totalQuestions = questions.length;
  const completionPercentage = totalQuestions > 0 
    ? (progress.completed / totalQuestions) * 100 
    : 0;
  const accuracy = progress.completed > 0
    ? (progress.correct / progress.completed) * 100
    : 0;

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log("Download questions");
  };

  const handleShare = () => {
    // Placeholder for share functionality
    console.log("Share questions");
  };

  const handleReset = () => {
    // Placeholder for reset functionality
    console.log("Reset all answers");
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 md:px-6 pt-24 pb-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-breathing">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Generating Your Questions...
                </h1>
                <p className="text-muted-foreground">
                  Our AI is analyzing the job description and creating tailored questions
                </p>
              </div>
            </div>
          </div>

          {/* Skeleton Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-20 bg-muted animate-breathing rounded" />
                      <div className="h-8 w-12 bg-muted animate-breathing rounded" />
                    </div>
                    <div className="rounded-full bg-accent p-3 animate-breathing">
                      <div className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeleton Questions */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <QuestionSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-5xl px-4 md:px-6 pt-24">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Failed to Generate Questions
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-5xl px-4 md:px-6 pt-24">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              No Questions Generated
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Go back to the dashboard to generate interview questions tailored to your target role
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 md:px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Interview Questions
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{totalQuestions} questions</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                  <p className="text-3xl font-bold text-foreground">{totalQuestions}</p>
                </div>
                <div className="rounded-full bg-accent p-3">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{progress.completed}</p>
                </div>
                <div className="rounded-full bg-accent p-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-3xl font-bold text-foreground">
                    {accuracy.toFixed(0)}%
                  </p>
                </div>
                <div className="rounded-full bg-accent p-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.floor((Date.now() - startTime.getTime()) / 60000)}m
                  </p>
                </div>
                <div className="rounded-full bg-accent p-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="border border-border mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">Overall Progress</h3>
                <Badge variant="secondary">
                  {progress.completed}/{totalQuestions}
                </Badge>
              </div>
              <span className="text-sm font-medium text-primary">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {progress.correct} Correct
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {progress.incorrect} Incorrect
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  {totalQuestions - progress.completed} Remaining
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Celebration */}
        {completionPercentage === 100 && (
          <Card className="border border-primary bg-primary/5 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/20 p-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You've completed all questions with {accuracy.toFixed(0)}% accuracy. 
                    Ready for your interview!
                  </p>
                </div>
                <Button>
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Options */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            All Questions
          </Button>
          <Button variant="ghost" size="sm">
            Unanswered
          </Button>
          <Button variant="ghost" size="sm">
            Correct
          </Button>
          <Button variant="ghost" size="sm">
            Incorrect
          </Button>
        </div>

        {/* Questions List */}
        <QuestionList questions={questions} />
      </main>
    </div>
  );
}
