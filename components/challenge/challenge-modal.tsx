// Challenge Modal Component
// Shows detailed challenge information and flag submission form

"use client"

import { useState } from "react"
import type { Challenge } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import { validateFlag, getDifficultyStars, formatPoints } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Download, ExternalLink, CheckCircle, XCircle, Users, Flag } from "lucide-react"

interface ChallengeModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
  isSolved?: boolean
  onSolve?: () => void
}

export function ChallengeModal({ challenge, isOpen, onClose, isSolved = false, onSolve }: ChallengeModalProps) {
  const { user } = useAuth()
  const [flag, setFlag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Handle flag submission
  const handleSubmitFlag = async () => {
    if (!user || !flag.trim()) return

    // Validate flag format
    if (!validateFlag(flag.trim())) {
      setFeedback({
        type: "error",
        message: "Flag must be in format CTF{...}",
      })
      return
    }

    setIsSubmitting(true)
    setFeedback({ type: null, message: "" })

    try {
      // Check if flag is correct
      if (flag.trim() === challenge.flag) {
        // Submit solve to database
        const { error } = await supabase.from("solves").insert({
          user_id: user.id,
          team_id: user.team_id,
          challenge_id: challenge.id,
        })

        if (error) {
          // Handle duplicate solve error
          if (error.code === "23505") {
            setFeedback({
              type: "error",
              message: "You have already solved this challenge!",
            })
          } else {
            throw error
          }
        } else {
          setFeedback({
            type: "success",
            message: "Correct! Challenge solved! 🎉",
          })
          setFlag("")
          onSolve?.()
        }
      } else {
        setFeedback({
          type: "error",
          message: "Incorrect flag. Try again!",
        })
      }
    } catch (error) {
      console.error("Error submitting flag:", error)
      setFeedback({
        type: "error",
        message: "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file download
  const handleDownload = async () => {
    if (!challenge.file_path) return

    try {
      const { data, error } = await supabase.storage.from("challenge-files").download(challenge.file_path)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = challenge.file_path.split("/").pop() || "challenge-file"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            {challenge.title}
            {isSolved && <CheckCircle className="w-6 h-6 text-green-400" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge info */}
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant="outline" className="text-cyan-400 border-cyan-500">
              {challenge.category}
            </Badge>
            <div className="text-cyan-400 font-bold text-lg">{formatPoints(challenge.points)} points</div>
            <div className="text-yellow-400">{getDifficultyStars(challenge.difficulty)}</div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              {challenge.solve_count} solves
            </div>
          </div>

          {/* Challenge description */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{challenge.description}</p>
          </div>

          {/* External link */}
          {challenge.link && (
            <Button
              asChild
              variant="outline"
              className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              <a href={challenge.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Challenge Link
              </a>
            </Button>
          )}

          {/* File download */}
          {challenge.file_path && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Challenge File
            </Button>
          )}

          {/* Flag submission */}
          {!isSolved && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Submit Flag
                </h3>

                <div className="flex gap-2">
                  <Input
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="CTF{your_flag_here}"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitFlag()}
                  />
                  <Button
                    onClick={handleSubmitFlag}
                    disabled={isSubmitting || !flag.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit"}
                  </Button>
                </div>
              </div>

              {/* Feedback */}
              {feedback.type && (
                <Alert
                  className={
                    feedback.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                  }
                >
                  <div className="flex items-center gap-2">
                    {feedback.type === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <AlertDescription className={feedback.type === "success" ? "text-green-400" : "text-red-400"}>
                      {feedback.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          )}

          {/* Already solved message */}
          {isSolved && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-400">
                You have already solved this challenge! Great job! 🎉
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
