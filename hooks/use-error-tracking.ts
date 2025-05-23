"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export function useErrorTracking(userId?: string, username?: string) {
  useEffect(() => {
    // Skip in development
    if (process.env.NODE_ENV !== "production") return

    // Set user information if available
    if (userId) {
      Sentry.setUser({
        id: userId,
        username: username || undefined,
      })
    } else {
      Sentry.setUser(null)
    }

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      Sentry.captureException(event.reason, {
        extra: {
          type: "unhandledrejection",
        },
      })
    }

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error, {
        extra: {
          type: "error",
          message: event.message,
        },
      })
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [userId, username])
}
