import { notFound } from "next/navigation";
import { getQuestionSetById } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import QuestionList from "@/components/questions/QuestionList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionSetPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const questionSet = await getQuestionSetById(id, userId);

  if (!questionSet) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-12 relative z-10">
        {/* Back Button */}
        <Link href="/feed">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
        </Link>

        {/* Job Description Card */}
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-700/50 bg-gray-900/50 px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Interview Questions
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(questionSet.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    {questionSet.isPublic ? (
                      <>
                        <Globe className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                  <span>•</span>
                  <span>{Array.isArray(questionSet.questions) ? questionSet.questions.length : 0} Questions</span>
                </div>
              </div>
              {questionSet.isPublic && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Community
                </Badge>
              )}
            </div>
          </div>

          {/* Job Description Content */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
              Job Description
            </h2>
            <div className="prose prose-invert prose-emerald max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {questionSet.jobDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Interview Questions
            </h2>
            <p className="text-gray-400">
              Practice these questions to prepare for your interview
            </p>
          </div>
          
          <QuestionList 
            questions={Array.isArray(questionSet.questions) ? questionSet.questions : []} 
          />
        </div>
      </main>
    </div>
  );
}
