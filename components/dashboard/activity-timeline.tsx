import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, Plus, Edit, Trash } from "lucide-react"

interface Activity {
  id: string
  type:
    | "create_project"
    | "update_project"
    | "delete_project"
    | "create_task"
    | "update_task"
    | "complete_task"
    | "delete_task"
  entityName: string
  timestamp: Date
  userId: string
  userName: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "create_project":
      case "create_task":
        return <Plus className="h-4 w-4 text-green-500" />
      case "update_project":
      case "update_task":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete_project":
      case "delete_task":
        return <Trash className="h-4 w-4 text-red-500" />
      case "complete_task":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "create_project":
        return `created project "${activity.entityName}"`
      case "update_project":
        return `updated project "${activity.entityName}"`
      case "delete_project":
        return `deleted project "${activity.entityName}"`
      case "create_task":
        return `created task "${activity.entityName}"`
      case "update_task":
        return `updated task "${activity.entityName}"`
      case "complete_task":
        return `completed task "${activity.entityName}"`
      case "delete_task":
        return `deleted task "${activity.entityName}"`
      default:
        return `interacted with "${activity.entityName}"`
    }
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-muted p-1">{getActivityIcon(activity.type)}</div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.userName}</span> {getActivityText(activity)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
