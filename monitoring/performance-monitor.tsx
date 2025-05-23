"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export function PerformanceMonitor() {
  useEffect(() => {
    // Skip in development
    if (process.env.NODE_ENV !== "production") return

    // Create a performance observer
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Report only specific metrics
        if (
          entry.entryType === "largest-contentful-paint" ||
          entry.entryType === "first-input" ||
          entry.entryType === "layout-shift"
        ) {
          Sentry.captureMessage(`Performance: ${entry.entryType}`, {
            level: "info",
            extra: {
              ...entry.toJSON(),
            },
          })
        }
      })
    })

    // Observe performance metrics
    observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
