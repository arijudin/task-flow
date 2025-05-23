"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Frame } from "lucide-react"
import { login } from "../actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    const result = await login(formData)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setErrors(result.errors || {})
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <Frame className="h-8 w-8" />
              <span className="text-xl font-bold">TaskFlow</span>
            </Link>
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-semibold text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>}
            </div>

            {errors._form && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{errors._form[0]}</p>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link href="/signup" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
