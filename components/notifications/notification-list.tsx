"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Check, AlertCircle, Clock, Info } from "lucide-react"
import { markNotificationAsRead } from "@/app/actions/notifications"

interface NotificationListProps {
  notifications: any[]
  onNotificationRead?: () => void
}

export function NotificationList({ notifications, onNotificationRead }: NotificationListProps) {
  const router = useRouter()
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.isRead && !readNotifications.has(notification.id)) {
      const result = await markNotificationAsRead(notification.id)
      if (result.success) {
        setReadNotifications((prev) => new Set(prev).add(notification.id))
        onNotificationRead?.()
      }
    }

    // Navigate to related content if available
    if (notification.relatedType && notification.relatedId) {
      if (notification.relatedType === "task") {
        // Find the project ID first
        const projectId = notification.relatedId.split("-")[0] // Simplified; in real app, you'd query for this
        router.push(`/dashboard/projects/${projectId}?taskId=${notification.relatedId}`)
      } else if (notification.relatedType === "project") {
        router.push(`/dashboard/projects/${notification.relatedId}`)
      }
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_due":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "task_assigned":
        return <Check className="h-5 w-5 text-green-500" />
      case "project_update":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    )
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {notifications.map((notification) => {
        const isRead = notification.isRead || readNotifications.has(notification.id)

        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer ${!isRead ? "bg-muted/20" : ""}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <p className={`text-sm ${!isRead ? "font-medium" : ""}`}>{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
