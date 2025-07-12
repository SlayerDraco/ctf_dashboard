// Enhanced Countdown Timer Component
// Shows time remaining with improved styling and animations

"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: string
  label: string
  onComplete?: () => void
}

export function CountdownTimer({ targetDate, label, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("")

  const formatCountdown = (targetDate: string): string => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) return "00:00:00"

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const updateTimer = () => {
      const formatted = formatCountdown(targetDate)
      setTimeLeft(formatted)

      if (formatted === "00:00:00" && onComplete) {
        onComplete()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  return (
    <div className="text-center bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-2">
        <Clock className="w-4 h-4" />
        {label}
      </div>
      <div className="text-3xl font-mono font-bold text-cyan-400 tracking-wider">{timeLeft}</div>
    </div>
  )
}
