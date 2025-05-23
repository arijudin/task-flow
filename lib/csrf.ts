import { randomBytes } from "crypto"
import { cookies } from "next/headers"

// Generate a CSRF token
export function generateCsrfToken(): string {
  const token = randomBytes(32).toString("hex")
  cookies().set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })
  return token
}

// Verify a CSRF token
export function verifyCsrfToken(token: string): boolean {
  const cookieToken = cookies().get("csrf_token")?.value
  if (!cookieToken) return false
  return token === cookieToken
}
