// Utility functions for the CTF platform
// This file contains helper functions used throughout the application

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge Tailwind CSS classes
// Helps avoid conflicts and ensures proper class precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validate flag format (must be CTF{...})
export const validateFlag = (flag: string): boolean => {
  const flagRegex = /^CTF\{.+\}$/
  return flagRegex.test(flag)
}

// Format points with commas for better readability
export const formatPoints = (points: number): string => {
  return points.toLocaleString()
}

// Get difficulty stars (1-5 stars)
export const getDifficultyStars = (difficulty: number): string => {
  return "★".repeat(difficulty) + "☆".repeat(5 - difficulty)
}

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Get category color for styling
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Web: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Crypto: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Reverse: "bg-red-500/20 text-red-400 border-red-500/30",
    Pwn: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Forensics: "bg-green-500/20 text-green-400 border-green-500/30",
    Misc: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }

  return colors[category] || colors["Misc"]
}

// Calculate team score from solves
export const calculateTeamScore = (solves: any[]): number => {
  return solves.reduce((total, solve) => total + (solve.challenge?.points || 0), 0)
}

// Check if CTF is currently running
export const isCTFRunning = (config: any): boolean => {
  if (!config?.ctf_started) return false

  const now = new Date()
  const startTime = config.ctf_start_time ? new Date(config.ctf_start_time) : null
  const endTime = config.ctf_end_time ? new Date(config.ctf_end_time) : null

  if (startTime && now < startTime) return false
  if (endTime && now > endTime) return false

  return true
}

// Format countdown timer
export const formatCountdown = (targetDate: string): string => {
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const difference = target - now

  if (difference <= 0) return "00:00:00"

  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
