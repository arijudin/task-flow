import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProductivitySummaryProps {
  completedTasks: number
  totalTasks: number
  tasksThisWeek: number
  tasksLastWeek: number
  averageCompletionTime: number // in hours
}

export function ProductivitySummary({
  completedTasks,
  totalTasks,
  tasksThisWeek,
  tasksLastWeek,
  averageCompletionTime,
}: ProductivitySummaryProps) {
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const weeklyChange = tasksLastWeek > 0 ? ((tasksThisWeek - tasksLastWeek) / tasksLastWeek) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Summary</CardTitle>
        <CardDescription>Your task completion metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Task Completion Rate</p>
            <p className="text-sm font-medium">{completionRate.toFixed(0)}%</p>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Weekly Performance</p>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{tasksThisWeek}</div>
            <div className="text-sm">
              tasks completed this week
              {weeklyChange !== 0 && (
                <span className={`ml-1 ${weeklyChange > 0 ? "text-green-500" : "text-red-500"}`}>
                  {weeklyChange > 0 ? "+" : ""}
                  {weeklyChange.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Average Completion Time</p>
          <div className="text-2xl font-bold">
            {averageCompletionTime.toFixed(1)} <span className="text-sm font-normal">hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
