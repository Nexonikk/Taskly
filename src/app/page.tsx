"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { SearchBar } from "./components/ui/SearchBar";
import { Select } from "./components/ui/Select";
import {
  TASK_STATUSES,
  TASK_CATEGORIES,
  KEYBOARD_SHORTCUTS,
} from "./utils/constants";
import { TaskColumn } from "./components/task/TaskColumn";
import {
  Check,
  Command,
  Plus,
  SlidersHorizontal,
  Keyboard,
  X,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "ongoing" | "completed";
  dueDate: string;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "ongoing" | "completed";
  dueDate: string;
}

interface KeyboardShortcut {
  action: string;
  key: string;
}

const Taskly = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "work",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("taskly-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading tasks");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("taskly-tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Error saving tasks");
    }
  }, [tasks]);

  useEffect(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus, filterPriority, sortBy]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        openModal();
      }
      if (e.ctrlKey && e.key === "d" && selectedTask) {
        e.preventDefault();
        deleteTask(selectedTask);
      }
      if (e.ctrlKey && e.key === "e" && selectedTask) {
        e.preventDefault();
        const task = tasks.find((t) => t.id === selectedTask);
        if (task) openModal(task);
      }
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowModal(false);
        setShowShortcuts(false);
        setShowFilters(false);
        setSelectedTask(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedTask, tasks]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const openModal = (task: Task | null = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        category: "work",
        priority: "medium",
        status: "pending",
        dueDate: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...formData,
                id: editingTask.id,
                createdAt: editingTask.createdAt,
              }
            : t
        )
      );
      showNotification("Task updated");
    } else {
      const newTask: Task = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      showNotification("Task created");
    }
    closeModal();
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setSelectedTask(null);
    showNotification("Task deleted");
  };

  const updateTaskStatus = (id: number, newStatus: Task["status"]) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== targetStatus) {
      updateTaskStatus(draggedTask.id, targetStatus);
      showNotification("Task moved");
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-900 bg-black/80 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Check size={18} strokeWidth={2.5} />
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Taskly
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Keyboard}
              onClick={() => setShowShortcuts(true)}
              className="text-gray-400 hover:text-gray-300"
            >
              Shortcuts
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search tasks..."
              inputRef={searchRef}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                showFilters ||
                filterStatus !== "all" ||
                filterPriority !== "all"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-900 hover:border-gray-800 bg-gray-950 text-gray-400 hover:text-gray-300"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-950 border border-gray-900 rounded-lg shadow-2xl p-4 space-y-4 animate-fadeIn z-50">
                <Select
                  label="Status"
                  value={filterStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterStatus(e.target.value)
                  }
                  options={[
                    { value: "all", label: "All" },
                    { value: "pending", label: "Pending" },
                    { value: "ongoing", label: "Ongoing" },
                    { value: "completed", label: "Completed" },
                  ]}
                />
                <Select
                  label="Priority"
                  value={filterPriority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterPriority(e.target.value)
                  }
                  options={[
                    { value: "all", label: "All" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                  ]}
                />
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSortBy(e.target.value)
                  }
                  options={[
                    { value: "date", label: "Created date" },
                    { value: "priority", label: "Priority" },
                    { value: "dueDate", label: "Due date" },
                  ]}
                />
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => openModal()}
          >
            New task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={filteredTasks.filter((t) => t.status === status)}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
              onEditTask={openModal}
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gray-950 border border-gray-900 rounded-xl w-full max-w-lg shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
              <h2 className="text-base font-semibold">
                {editingTask ? "Edit task" : "New task"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Input
                label="Title"
                placeholder="Task title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add details..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-black border border-gray-900 rounded-lg focus:outline-none focus:border-blue-600 text-sm resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  options={TASK_CATEGORIES.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                />

                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "pending"
                        | "ongoing"
                        | "completed",
                    })
                  }
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "pending"
                        | "ongoing"
                        | "completed",
                    })
                  }
                  options={TASK_STATUSES.map((status) => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                  }))}
                />

                <Input
                  label="Due date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-900">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="flex-1"
              >
                {editingTask ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gray-950 border border-gray-900 rounded-xl w-full max-w-md shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
              <div className="flex items-center gap-2">
                <Command size={18} className="text-blue-600" />
                <h2 className="text-base font-semibold">Keyboard shortcuts</h2>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1.5 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {KEYBOARD_SHORTCUTS.map(
                (shortcut: KeyboardShortcut, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-400">
                      {shortcut.action}
                    </span>
                    <kbd className="px-2.5 py-1 bg-black border border-gray-900 rounded text-xs font-medium text-gray-400">
                      {shortcut.key}
                    </kbd>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.96);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -12px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Taskly;
