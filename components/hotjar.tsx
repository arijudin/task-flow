"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    hj: any
    _hjSettings: any
  }
}

interface HotjarProps {
  hjid: number
  hjsv: number
}

export function Hotjar({ hjid, hjsv }: HotjarProps) {
  useEffect(() => {
    // Skip in development
    if (process.env.NODE_ENV !== "production") return

    // Initialize Hotjar
    window._hjSettings = { hjid, hjsv }

    const script = document.createElement("script")
    script.async = true
    script.src = `https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hjsv}`

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [hjid, hjsv])

  return null
}
