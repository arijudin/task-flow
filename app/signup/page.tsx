"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Frame } from "lucide-react"
import { signup } from "../actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    const result = await signup(formData)

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
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={handleSubmit}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="mt-2">
                <Input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2">
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
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
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
