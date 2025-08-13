'use client'

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", active: pathname === "/" },
    { href: "/requests", label: "My Requests", active: pathname === "/requests" },
    { href: "/history", label: "Point History", active: pathname === "/history" },
    { href: "/profile", label: "Profile", active: pathname === "/profile" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center" data-testid="link-logo">
              <div className="w-10 h-10 bg-airline-blue rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-airline-blue">Smile Airlines</h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8" data-testid="nav-main">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 transition-colors ${
                    item.active
                      ? "text-airline-blue font-medium border-b-2 border-airline-blue"
                      : "text-gray-600 hover:text-airline-blue"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-3" data-testid="user-menu">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700" data-testid="text-user-name">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500" data-testid="text-user-tier">
                  {user?.membershipTier || 'Silver'} Member
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 rounded-full bg-airline-blue text-white hover:bg-airline-blue/90"
                    data-testid="button-user-menu"
                  >
                    {user?.firstName?.[0] || 'U'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" data-testid="menu-item-profile">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="menu-item-logout">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  )
}