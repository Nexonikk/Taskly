export const TASK_CATEGORIES = [
  "work",
  "personal",
  "shopping",
  "health",
  "other",
];
export const TASK_STATUSES: Array<"pending" | "ongoing" | "completed"> = [
  "pending",
  "ongoing",
  "completed",
];

export const KEYBOARD_SHORTCUTS = [
  { key: "Ctrl + N", action: "Create new task" },
  { key: "Ctrl + E", action: "Edit selected task" },
  { key: "Ctrl + D", action: "Delete selected task" },
  { key: "Ctrl + K", action: "Open shortcuts" },
  { key: "Ctrl + F", action: "Focus search" },
  { key: "Esc", action: "Close modal" },
];
