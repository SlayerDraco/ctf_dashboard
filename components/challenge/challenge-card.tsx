// Challenge Card Component
// Displays individual challenge information in a card format

"use client"

import { useState } from "react"
import type { Challenge } from "@/lib/supabase"
import { getDifficultyStars, getCategoryColor, formatPoints } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChallengeModal } from "./challenge-modal"
import { CheckCircle, Users } from "lucide-react"

interface ChallengeCardProps {
  challenge: Challenge
  isSolved?: boolean
  onSolve?: () => void
}

export function ChallengeCard({ challenge, isSolved = false, onSolve }: ChallengeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="bg-gray-900/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              {challenge.title}
              {isSolved && <CheckCircle className="w-5 h-5 text-green-400" />}
            </CardTitle>
            <div className="text-right">
              <div className="text-cyan-400 font-bold text-lg">{formatPoints(challenge.points)}</div>
              <div className="text-yellow-400 text-sm">{getDifficultyStars(challenge.difficulty)}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Category badge */}
          <Badge variant="outline" className={getCategoryColor(challenge.category)}>
            {challenge.category}
          </Badge>

          {/* Challenge description preview */}
          <p className="text-gray-300 text-sm line-clamp-2">{challenge.description}</p>

          {/* Solve count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              {challenge.solve_count} solves
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={!challenge.enabled}
            >
              {isSolved ? "View" : "Solve"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Challenge modal */}
      <ChallengeModal
        challenge={challenge}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSolved={isSolved}
        onSolve={onSolve}
      />
    </>
  )
}
