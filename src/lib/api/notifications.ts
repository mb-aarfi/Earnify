import { simulateApiCall } from "@/lib/api/client";
import { mockNotifications } from "@/mocks/notifications";

export async function getNotifications(userId: string) {
  const notifications = mockNotifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return simulateApiCall(notifications);
}

export async function markNotificationRead(id: string) {
  const notification = mockNotifications.find(
    (notification) => notification.id === id
  );

  if (!notification) {
    return {
      success: false as const,
      error: {
        code: "NOT_FOUND",
        message: "Notification not found",
      },
    };
  }

  notification.read = true;

  return simulateApiCall({ success: true });
}

export async function markAllNotificationsRead(userId: string) {
  mockNotifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  return simulateApiCall({ success: true });
}

export async function getUnreadCount(userId: string) {
  const count = mockNotifications.filter((n) => n.userId === userId && !n.read).length;
  return simulateApiCall({ count });
}
