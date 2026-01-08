import { cn } from "@/lib/utils"

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition",
        className
      )}
      {...props}
    />
  )
}
