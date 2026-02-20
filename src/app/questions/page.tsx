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
  const [jobDescription, setJobDescription] = useState("");
  const [summarizedJobDescription, setSummarizedJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [questionSetId, setQuestionSetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [motivationalIndex, setMotivationalIndex] = useState(0);

  // Motivational messages for loading state
  const motivationalMessages = [
    "Preparation is the key to success...",
    "Every expert was once a beginner...",
    "Your dream job is within reach...",
    "Practice makes perfect...",
    "Confidence comes from preparation...",
    "You're one step closer to your goal...",
    "Great opportunities are ahead...",
    "Invest in yourself, it pays the best interest...",
    "Success is where preparation meets opportunity...",
    "Your future starts with this moment...",
  ];

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

        // Store job description for later use
        setJobDescription(jobDescription);

        // Simulate progress while waiting
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => Math.min(prev + 5, 95));
        }, 500);

        try {
          const response = await fetch("/api/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription }),
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
            setQuestions(data.questions);
            
            // Store job title and summarized description if provided
            if (data.jobTitle) {
              sessionStorage.setItem("jobTitle", data.jobTitle);
              setJobTitle(data.jobTitle);
            }
            if (data.summarizedJobDescription) {
              sessionStorage.setItem("summarizedJobDescription", data.summarizedJobDescription);
              setSummarizedJobDescription(data.summarizedJobDescription);
            }
            
            // Auto-save if user requested it
            if (saveQuestions) {
              try {
                const saveResponse = await fetch("/api/questions/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    jobTitle: data.jobTitle ?? "Software Engineer",
                    summarizedJobDescription: data.summarizedJobDescription ?? jobDescription,
                    questions: data.questions,
                    isPublic: false,
                  }),
                });

                const saveData = await saveResponse.json();

                if (saveResponse.ok && !saveData.error) {
                  sessionStorage.setItem("questionSetId", saveData.questionSetId);
                  sessionStorage.setItem("questionsSaved", "true");
                  setIsSaved(true);
                  setQuestionSetId(saveData.questionSetId);
                  console.log("✅ Questions auto-saved:", saveData.questionSetId);
                }
              } catch (saveError) {
                console.error("Failed to auto-save questions:", saveError);
                // Don't show error to user - they can manually save later
              }
            }
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
        const storedJobDesc = sessionStorage.getItem("pendingJobDescription");
        const storedJobTitle = sessionStorage.getItem("jobTitle");
        const storedQuestionSetId = sessionStorage.getItem("questionSetId");
        const questionsSaved = sessionStorage.getItem("questionsSaved") === "true";
        
        if (stored) {
          setQuestions(JSON.parse(stored));
        }
        if (storedJobDesc) {
          setJobDescription(storedJobDesc);
        }
        const storedSummarizedJobDesc = sessionStorage.getItem("summarizedJobDescription");
        if (storedSummarizedJobDesc) {
          setSummarizedJobDescription(storedSummarizedJobDesc);
        }
        if (storedJobTitle) {
          setJobTitle(storedJobTitle);
        }
        if (questionsSaved && storedQuestionSetId) {
          setIsSaved(true);
          setQuestionSetId(storedQuestionSetId);
        }
        
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Cycle through motivational messages during loading
  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setMotivationalIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 2000); 

    return () => clearInterval(messageInterval);
  }, [isLoading, motivationalMessages.length]);

  const handleDownload = () => {
    // Helper function to escape CSV fields
    const escapeCsvField = (field: string): string => {
      // If field contains comma, quote, or newline, wrap in quotes and escape quotes
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    // Create CSV header
    const headers = ['Question', 'Options', 'Correct Answer(s)', 'Explanation'];
    const csvRows = [headers.join(',')];

    // Convert each question to CSV row
    questions.forEach((q, index) => {
      // Format options as numbered list
      const optionsText = q.options
        .map((opt, idx) => `${idx + 1}. ${opt}`)
        .join('; ');

      // Get correct answer text(s)
      const correctAnswersText = q.correctAnswers
        .map(idx => q.options[idx])
        .join('; ');

      const row = [
        escapeCsvField(q.question),
        escapeCsvField(optionsText),
        escapeCsvField(correctAnswersText),
        escapeCsvField(q.explanation)
      ];

      csvRows.push(row.join(','));
    });

    // Join all rows with newline
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'interview-questions.csv');
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveQuestions = async () => {
    if (isSaved) {
      // If already saved, just toggle the UI state (unsaving not implemented)
      return;
    }

    if (!jobTitle) {
      setError("No job title found. Cannot save questions.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/questions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          summarizedJobDescription: summarizedJobDescription || jobDescription,
          questions,
          isPublic: false,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Failed to save questions");
        return;
      }

      // Update state
      setIsSaved(true);
      setQuestionSetId(data.questionSetId);
      
      // Update session storage
      sessionStorage.setItem("questionsSaved", "true");
      sessionStorage.setItem("questionSetId", data.questionSetId);

      console.log("✅ Questions saved successfully:", data.questionSetId);
    } catch (err) {
      console.error("Failed to save questions:", err);
      setError("Failed to save questions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMakePublic = async () => {
    if (!isSaved || !questionSetId) {
      setError("Questions must be saved before making them public");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const newIsPublic = !isPublic;
      
      const response = await fetch(`/api/questions/${questionSetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: newIsPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Failed to update question visibility");
        return;
      }

      // Update state
      setIsPublic(newIsPublic);
      console.log(`✅ Questions made ${newIsPublic ? 'public' : 'private'}`);
    } catch (err) {
      console.error("Failed to update question visibility:", err);
      setError("Failed to update question visibility. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state with simple progress bar
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
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
            <div className="min-h-6 flex items-center justify-center">
              <p 
                key={motivationalIndex}
                className="text-sm text-center text-gray-400 animate-[fadeIn_0.5s_ease-in-out]"
              >
                {motivationalMessages[motivationalIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
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
              <Button onClick={() => window.location.reload()} className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
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
      <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
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
            <Button onClick={() => router.push("/dashboard")} className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
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
                {jobTitle || "Your Interview Questions"}
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
                className="bg-gray-800 text-white border-emerald-500/50 hover:bg-gray-700 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveQuestions}
                disabled={isSaving || isSaved}
                className={isSaved 
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300" 
                  : "bg-gray-800 text-white border-emerald-500/50 hover:bg-gray-700 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
                }
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Questions'}
              </Button>
              
              {isSaved && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMakePublic}
                  disabled={isSaving}
                  className={isPublic 
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300" 
                    : "bg-gray-800 text-white border-emerald-500/50 hover:bg-gray-700 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
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
