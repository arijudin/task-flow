"use client"

import { useId } from "react"

interface CsrfFieldProps {
  token: string
}

export function CsrfField({ token }: CsrfFieldProps) {
  const id = useId()
  return <input type="hidden" id={id} name="csrf_token" value={token} />
}
