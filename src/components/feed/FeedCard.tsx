"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Layers, Clock, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeedCardProps = {
  data: {
    id: string;
    jobDescription: string;
    questions: any[]; // Using any to match JSONB return, ideally typed
    createdAt: string;
  };
};

export default function FeedCard({ data }: FeedCardProps) {
  const router = useRouter();
  const { jobDescription, questions, createdAt } = data;
  
  // Create a title from the first line or a slice of the job description
  const title = jobDescription.split("\n")[0].slice(0, 50) + (jobDescription.length > 50 ? "..." : "");
  const questionCount = Array.isArray(questions) ? questions.length : 0;
  
  // Generate a tech stack tags based on common keywords (simple heuristic)
  const techKeywords = ["React", "Node", "Python", "Java", "AWS", "SQL", "Go", "Rust", "TypeScript", "DevOps", "Frontend", "Backend"];
  const tags = techKeywords.filter(k => jobDescription.toLowerCase().includes(k.toLowerCase())).slice(0, 3);

  const handlePractice = () => {
    // Current flow relies on sessionStorage
    sessionStorage.setItem("questions", JSON.stringify(questions));
    sessionStorage.setItem("questionSetId", data.id);
    // Indicate it's saved/public so we might not need to save again immediately
    sessionStorage.setItem("questionsSaved", "true"); 
    
    router.push("/questions");
  };

  return (
    <div 
      className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-glow hover:border-primary/50 cursor-pointer"
      onClick={handlePractice}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            Public
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 leading-tight">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.length > 0 ? (
            tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-secondary text-[10px] font-medium text-secondary-foreground">
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-[10px] font-medium text-secondary-foreground">
              General
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="w-4 h-4" />
          <span>{questionCount} Questions</span>
        </div>
        
        <button 
          className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
        >
          Practice <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
