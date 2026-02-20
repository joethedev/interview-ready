"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Layers, Clock, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeedCardProps = {
  data: {
    id: string;
    jobDescription: string;
    jobTitle?: string;
    questions: any[]; // Using any to match JSONB return, ideally typed
    createdAt: string;
  };
};

export default function FeedCard({ data }: FeedCardProps) {
  const router = useRouter();
  const { jobDescription, jobTitle, questions, createdAt } = data;
  
  // Use job_title if available, otherwise create a title from the first line of job description
  const firstLine = jobDescription.split("\n")[0].trim();
  const fallbackTitle = firstLine.length > 60 ? firstLine.slice(0, 60) + "..." : firstLine;
  const title = jobTitle || fallbackTitle;
  const questionCount = Array.isArray(questions) ? questions.length : 0;
  
  // Generate tech stack tags based on common keywords
  const techKeywords = ["React", "Node", "Python", "Java", "JavaScript", "TypeScript", "AWS", "Azure", "SQL", "MongoDB", "Go", "Rust", "DevOps", "Docker", "Kubernetes", "Frontend", "Backend", "Full Stack"];
  const tags = techKeywords.filter(k => jobDescription.toLowerCase().includes(k.toLowerCase())).slice(0, 4);

  const handlePractice = () => {
    // Navigate to dedicated question set page
    router.push(`/question-sets/${data.id}`);
  };

  return (
    <div 
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-500/50 cursor-pointer overflow-hidden"
      onClick={handlePractice}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:via-emerald-500/3 group-hover:to-teal-500/5 transition-all duration-500" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-2 py-0.5">
            Public
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white line-clamp-2 leading-snug min-h-[3.5rem]">
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {tags.length > 0 ? (
            tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-800/60 border border-gray-700/50 text-xs font-medium text-emerald-300"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-800/60 border border-gray-700/50 text-xs font-medium text-gray-400">
              General IT
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700/50 relative z-10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Layers className="w-4 h-4" />
          <span className="font-medium">{questionCount}</span>
          <span className="text-gray-500">Questions</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <span>Practice</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
