"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    // Save language preference to localStorage
    localStorage.setItem("language", lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("id")}>Bahasa Indonesia</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("ja")}>日本語</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
