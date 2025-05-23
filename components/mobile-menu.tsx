"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/app/actions/auth"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    setOpen(false)
    await logout()
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      active: pathname?.includes("/dashboard/projects"),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b pb-4">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <span className="text-xl font-bold">TaskFlow</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4 py-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  route.active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t pt-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
