"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MessageSquare } from "lucide-react"

export function FeedbackForm() {
  const [open, setOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState("general")
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, you would send this to your backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Feedback submitted:", {
        type: feedbackType,
        feedback,
        email,
      })

      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setOpen(false)
        setFeedbackType("general")
        setFeedback("")
        setEmail("")
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg">
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open feedback form</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            We'd love to hear your thoughts about TaskFlow. Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-4">
            <h3 className="text-lg font-medium">Thank you for your feedback!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              We appreciate your input and will use it to improve TaskFlow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-type">Feedback Type</Label>
                <RadioGroup
                  id="feedback-type"
                  value={feedbackType}
                  onValueChange={setFeedbackType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General Feedback</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Bug Report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature">Feature Request</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <p className="text-xs text-muted-foreground">
                  We'll only use this to follow up on your feedback if needed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !feedback}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
