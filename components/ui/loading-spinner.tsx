// Enhanced Loading Spinner Component
// A reusable loading indicator with Matrix-style cyan color and improved animations

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-600 border-t-cyan-400 shadow-lg shadow-cyan-400/20",
          sizeClasses[size],
        )}
      />
    </div>
  )
}
