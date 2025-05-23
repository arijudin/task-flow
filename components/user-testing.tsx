"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserTestingProps {
  testId: string
  testName: string
  testDescription: string
  testTasks: string[]
}

export function UserTesting({ testId, testName, testDescription, testTasks }: UserTestingProps) {
  const [open, setOpen] = useState(false)
  const [hasSeenTest, setHasSeenTest] = useState(false)
  const [currentTask, setCurrentTask] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [taskTimes, setTaskTimes] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Check if user has seen this test before
    const seenTests = JSON.parse(localStorage.getItem("seenTests") || "{}")

    if (!seenTests[testId]) {
      // Show the test after a delay
      const timer = setTimeout(() => {
        setOpen(true)
        setHasSeenTest(true)

        // Mark as seen
        localStorage.setItem(
          "seenTests",
          JSON.stringify({
            ...seenTests,
            [testId]: true,
          }),
        )
      }, 60000) // Show after 1 minute

      return () => clearTimeout(timer)
    } else {
      setHasSeenTest(true)
    }
  }, [testId])

  const startTest = () => {
    setStartTime(Date.now())
  }

  const completeTask = () => {
    if (startTime) {
      const taskTime = Date.now() - startTime
      setTaskTimes([...taskTimes, taskTime])
    }

    if (currentTask < testTasks.length - 1) {
      setCurrentTask(currentTask + 1)
      setStartTime(Date.now())
    } else {
      setIsCompleted(true)
    }
  }

  const submitResults = () => {
    // In a real app, you would send this to your backend
    console.log("User test results:", {
      testId,
      testName,
      taskTimes,
      totalTime: taskTimes.reduce((a, b) => a + b, 0),
    })

    setOpen(false)
  }

  if (hasSeenTest) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{testName}</DialogTitle>
          <DialogDescription>{testDescription}</DialogDescription>
        </DialogHeader>

        {!startTime && !isCompleted ? (
          <div className="py-4">
            <p className="mb-4">
              We'd like to invite you to participate in a quick user test. This will help us improve TaskFlow.
            </p>
            <p className="mb-4">You'll be asked to complete {testTasks.length} simple tasks.</p>
            <Button onClick={startTest} className="w-full">
              Start Test
            </Button>
          </div>
        ) : isCompleted ? (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Thank you for completing the test!</h3>
            <p className="mb-4">Your feedback is valuable to us and will help improve TaskFlow.</p>
            <div className="mb-4">
              <h4 className="font-medium">Task Completion Times:</h4>
              <ul className="mt-2 space-y-1">
                {testTasks.map((task, index) => (
                  <li key={index} className="flex justify-between">
                    <span>Task {index + 1}:</span>
                    <span>{(taskTimes[index] / 1000).toFixed(2)} seconds</span>
                  </li>
                ))}
                <li className="flex justify-between font-medium border-t pt-1 mt-2">
                  <span>Total:</span>
                  <span>{(taskTimes.reduce((a, b) => a + b, 0) / 1000).toFixed(2)} seconds</span>
                </li>
              </ul>
            </div>
            <Button onClick={submitResults} className="w-full">
              Submit Results
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">
              Task {currentTask + 1} of {testTasks.length}
            </h3>
            <p className="mb-4">{testTasks[currentTask]}</p>
            <Button onClick={completeTask} className="w-full">
              Mark as Completed
            </Button>
          </div>
        )}

        <DialogFooter>
          <p className="text-xs text-muted-foreground">You can opt out of user testing in your account settings.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
