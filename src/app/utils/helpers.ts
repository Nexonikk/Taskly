export type TaskStatus = "pending" | "ongoing" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    ongoing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    pending: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  return colors[status] || colors.pending;
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    high: "text-red-400",
    medium: "text-yellow-400",
    low: "text-emerald-400",
  };
  return colors[priority] || colors.medium;
};

export const getStatusDotColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    ongoing: "bg-yellow-500",
    pending: "bg-gray-500",
    completed: "bg-emerald-500",
  };
  return colors[status] || colors.pending;
};

export const formatDate = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
};
