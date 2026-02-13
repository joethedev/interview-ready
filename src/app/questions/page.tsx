"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionList from "@/components/questions/QuestionList";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Download,
  Bookmark,
  Globe,
  AlertCircle,
  Sparkles,
  Target,
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

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

        // Simulate progress while waiting
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => Math.min(prev + 5, 95));
        }, 500);

        try {
          const response = await fetch("/api/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription, saveQuestions }),
          });

          clearInterval(progressInterval);
          setLoadingProgress(100);

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

  const handleDownload = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'interview-questions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleSaveQuestions = () => {
    setIsSaved(!isSaved);
    // In real app, this would call an API to save questions
    console.log("Save questions:", !isSaved);
  };

  const handleMakePublic = () => {
    if (isSaved) {
      setIsPublic(!isPublic);
      // In real app, this would call an API to make questions public
      console.log("Make public:", !isPublic);
    }
  };

  // Loading state with simple progress bar
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-md w-full mx-4 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Generating Questions...
            </h2>
            <p className="text-gray-300 mb-6">
              AI is creating tailored interview questions
            </p>
          </div>
          
          <div className="space-y-3">
            <Progress value={loadingProgress} className="h-2" />
            <p className="text-sm text-center text-gray-400">
              Please wait, this may take a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
        <main className="mx-auto max-w-5xl px-4 md:px-6 pt-24 relative z-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Failed to Generate Questions
            </h1>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
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
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <main className="mx-auto max-w-5xl px-4 md:px-6 pt-24 relative z-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Target className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              No Questions Generated
            </h1>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Go back to the dashboard to generate interview questions tailored to your target role
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <main className="mx-auto max-w-5xl px-4 md:px-6 pt-24 pb-12 relative z-10">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* Title and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Your Interview Questions
              </h1>
              <p className="text-gray-400">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'} generated
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-emerald-500/50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveQuestions}
                className={isSaved 
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                  : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-emerald-500/50"
                }
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaved ? 'Saved' : 'Save Questions'}
              </Button>
              
              {isSaved && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMakePublic}
                  className={isPublic 
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                    : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-emerald-500/50"
                  }
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {isPublic ? 'Public' : 'Make Public'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <QuestionList questions={questions} />
      </main>
    </div>
  );
}
