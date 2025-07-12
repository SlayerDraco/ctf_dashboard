// Login/Signup Page
// Stylish authentication form with neumorphic design and OAuth support

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, signIn, signInWithProvider, resetPassword, signUpAndInsertUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react"

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
        const { error } = await signUpAndInsertUser(email, password, displayName)
        if (error) throw new Error(error)

        router.push("/dashboard")
      } else {
        // Handle signup
        if (!displayName.trim()) {
          throw new Error("Display name is required")
        }

       const { error } = await signUpAndInsertUser(email, password, displayName)
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent_70%)]" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Enhanced header */}
        <div className="text-center mb-8">
          <Link href="/" className="group inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-cyan-400 transition-all duration-300">
              CTF Platform
            </h1>
          </Link>
          <p className="text-gray-400 mt-3 text-lg">
            {isLogin ? "Welcome back, hacker!" : "Join the elite competition!"}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4" />
        </div>

        {/* Enhanced main form card */}
        <Card className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-500">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {showForgotPassword ? "Reset Password" : isLogin ? "Access Terminal" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : isLogin
                  ? "Enter your credentials to access the platform"
                  : "Create your account to start competing"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Enhanced Error/Success messages */}
            {message.type && (
              <Alert
                className={`border-2 ${
                  message.type === "success"
                    ? "border-green-500/50 bg-green-500/10 shadow-green-500/20"
                    : "border-red-500/50 bg-red-500/10 shadow-red-500/20"
                } shadow-lg backdrop-blur-sm`}
              >
                <AlertDescription
                  className={`${message.type === "success" ? "text-green-400" : "text-red-400"} font-medium`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Forgot password form */}
            {showForgotPassword ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="reset-email" className="text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 h-12 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 h-12 transition-all duration-300"
                >
                  ← Back to Login
                </Button>
              </form>
            ) : (
              <>
                {/* Enhanced main login/signup form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Display name (signup only) */}
                  {!isLogin && (
                    <div className="space-y-3">
                      <Label htmlFor="displayName" className="text-gray-300 font-medium">
                        Display Name
                      </Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 h-12 transition-all duration-300"
                        placeholder="Your hacker alias"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 h-12 transition-all duration-300"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 h-12 pr-12 transition-all duration-300"
                        placeholder="Your secure password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isLogin ? "Accessing..." : "Creating Account..."}
                      </>
                    ) : (
                      <>{isLogin ? "Access Platform" : "Create Account"}</>
                    )}
                  </Button>
                </form>

                {/* Forgot password link */}
                {isLogin && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm hover:bg-gray-800/50 transition-all duration-300"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                )}

                {/* Enhanced OAuth buttons */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900 text-gray-400 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthLogin("google")}
                      className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-300 bg-gray-800/50"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthLogin("github")}
                      className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-300 bg-gray-800/50"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>

                {/* Enhanced toggle between login/signup */}
                <div className="text-center pt-4 border-t border-gray-700/50">
                  <p className="text-gray-400 mb-3">{isLogin ? "New to the platform?" : "Already have an account?"}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setMessage({ type: null, text: "" })
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold hover:bg-cyan-500/10 px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    {isLogin ? "Create Account" : "Sign In Instead"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Enhanced back to home link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300 inline-flex items-center gap-2 hover:gap-3"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}