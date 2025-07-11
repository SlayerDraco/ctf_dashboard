// Login/Signup Page
// Stylish authentication form with neumorphic design and OAuth support

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, signIn, signUp, signInWithProvider, resetPassword } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Github, Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Form state
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Error and success messages
  const [message, setMessage] = useState<{
    type: "error" | "success" | null
    text: string
  }>({ type: null, text: "" })

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: null, text: "" })

    try {
      if (isLogin) {
        // Handle login
        const { error } = await signIn(email, password)
        if (error) throw error

        router.push("/dashboard")
      } else {
        // Handle signup
        if (!displayName.trim()) {
          throw new Error("Display name is required")
        }

        const { error } = await signUp(email, password, displayName)
        if (error) throw error

        setMessage({
          type: "success",
          text: "Account created successfully! Please check your email to verify your account.",
        })
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "An error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle OAuth login
  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await signInWithProvider(provider)
      if (error) throw error
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || `Failed to sign in with ${provider}`,
      })
    }
  }

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage({
        type: "error",
        text: "Please enter your email address",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await resetPassword(email)
      if (error) throw error

      setMessage({
        type: "success",
        text: "Password reset email sent! Check your inbox.",
      })
      setShowForgotPassword(false)
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send reset email",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render if user is logged in (will redirect)
  if (user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-cyan-400 hover:text-cyan-300">
            CTF Platform
          </Link>
          <p className="text-gray-400 mt-2">{isLogin ? "Welcome back, hacker!" : "Join the competition!"}</p>
        </div>

        {/* Main form card */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {showForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : isLogin
                  ? "Enter your credentials to access the platform"
                  : "Create your account to start competing"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success messages */}
            {message.type && (
              <Alert
                className={
                  message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                }
              >
                <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Forgot password form */}
            {showForgotPassword ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Send Reset Email"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-gray-400 hover:text-cyan-400"
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <>
                {/* Main login/signup form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Display name (signup only) */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-gray-300">
                        Display Name
                      </Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        placeholder="Your display name"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 pr-10"
                        placeholder="Your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyan-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : isLogin ? "Login" : "Sign Up"}
                  </Button>
                </form>

                {/* Forgot password link */}
                {isLogin && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}

                {/* OAuth buttons */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthLogin("google")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthLogin("github")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>

                {/* Toggle between login/signup */}
                <div className="text-center">
                  <p className="text-gray-400">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setMessage({ type: null, text: "" })
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-cyan-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
