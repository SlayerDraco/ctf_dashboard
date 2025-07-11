// Countdown Timer Component
// Shows time remaining until CTF starts or ends

"use client"

import { useState, useEffect } from "react"
import { formatCountdown } from "@/lib/utils"

interface CountdownTimerProps {
  targetDate: string
  label: string
  onComplete?: () => void
}

export function CountdownTimer({ targetDate, label, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateTimer = () => {
      const formatted = formatCountdown(targetDate)
      setTimeLeft(formatted)

      // Check if countdown is complete
      if (formatted === "00:00:00" && onComplete) {
        onComplete()
      }
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  return (
    <div className="text-center">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-mono font-bold text-cyan-400">{timeLeft}</div>
    </div>
  )
}
