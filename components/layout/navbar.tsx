// Navigation Bar Component
// Shows user info, navigation links, and logout functionality

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, signOut } from "@/lib/auth"
import { isAdmin } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield } from "lucide-react"

export function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Handle user logout
  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <nav className="bg-black/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-cyan-400 hover:text-cyan-300">
              CTF Platform
            </Link>

            {user && (
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Challenges
                </Link>
                <Link href="/scoreboard" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Scoreboard
                </Link>
                <Link href="/teams" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Teams
                </Link>
                {isAdmin(user) && (
                  <Link
                    href="/admin"
                    className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-cyan-400">
                  <User className="w-4 h-4 mr-2" />
                  {user.display_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-4">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                <Link href="/login">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
