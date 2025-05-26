import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { getCurrentUser } from "../actions/auth";
import { getNotifications } from "../actions/notifications";

export const metadata: Metadata = {
  title: "Dashboard | TaskFlow",
  description: "Manage your projects and tasks with TaskFlow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Get notifications
  const notifications = await getNotifications(10);
  const unreadCount = notifications.filter(
    (n: { isRead: boolean }) => !n.isRead,
  ).length;

  return (
    <>
      <Header
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
      />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col">{children}</main>
    </>
  );
}
