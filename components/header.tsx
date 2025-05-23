"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Frame, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { MobileMenu } from "@/components/mobile-menu"
import { logout } from "@/app/actions/auth"

interface HeaderProps {
  user: {
    id: string
    name: string | null
    email: string
  } | null
  notifications?: any[]
  unreadCount?: number
}

export function Header({ user, notifications = [], unreadCount = 0 }: HeaderProps) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Frame className="h-6 w-6" />
          <span className="text-xl font-bold hidden sm:inline-block">TaskFlow</span>
        </Link>

        {isDashboard && (
          <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/projects"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname?.includes("/dashboard/projects") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Projects
            </Link>
          </nav>
        )}

        <div className="flex items-center ml-auto gap-2">
          {user ? (
            <>
              <NotificationBell notifications={notifications} initialUnreadCount={unreadCount} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/projects">Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      logout()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="block md:hidden">
                <MobileMenu />
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
