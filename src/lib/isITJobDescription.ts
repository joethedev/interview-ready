const IT_KEYWORDS = [
    "developer",
    "engineer",
    "software",
    "frontend",
    "backend",
    "fullstack",
    "react",
    "node",
    "nestjs",
    "javascript",
    "typescript",
    "api",
    "cloud",
    "devops",
    "database",
    "sql",
    "aws",
    "docker",
    "kubernetes",
    "microservices",
    "agile",
    "scrum",
    "nextjs",
    "vue",
    "angular",
    "html",
    "css",
    "full stack",
    "java",
    "python",
    "c++",  
    "c#",
    "ruby",
    "php",
];

export function isLikelyIT(jobDescription: string) {
  const text = jobDescription.toLowerCase();
  const matches = IT_KEYWORDS.filter((k) => text.includes(k));
  console.log("IT keyword matches:", matches);
  return matches.length >= 2; // threshold
}
