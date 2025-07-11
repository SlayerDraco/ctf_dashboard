// Landing Page
// The main entry point with Matrix-style dark theme and call-to-action

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Shield, Target, Trophy, Users } from "lucide-react"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render landing page if user is logged in (will redirect)
  if (user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-cyan-400">CTF Platform</div>
          <div className="space-x-4">
            <Button asChild variant="ghost" className="text-gray-300 hover:text-cyan-400">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
              <Link href="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              CAPTURE
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              THE FLAG
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Test your cybersecurity skills in our competitive hacking platform. Solve challenges, climb the leaderboard,
            and prove your expertise.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <Link href="/login">Login / Sign Up to Play</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Diverse Challenges</h3>
            <p className="text-gray-400">
              Web exploitation, cryptography, reverse engineering, and more categories to test your skills.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Team Competition</h3>
            <p className="text-gray-400">
              Form teams with up to 5 members and compete together for the top spot on the leaderboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Scoring</h3>
            <p className="text-gray-400">Live leaderboard updates as teams solve challenges and climb the rankings.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Platform</h3>
            <p className="text-gray-400">
              Built with security in mind, featuring proper authentication and data protection.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Hacking?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of security enthusiasts in the ultimate CTF experience.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 text-lg bg-transparent"
          >
            <Link href="/login">Get Started Now</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 CTF Platform. Built with Next.js and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
