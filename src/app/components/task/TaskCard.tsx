import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/app/utils/helpers";
import { Calendar, Edit2, Flag, GripVertical, Trash2 } from "lucide-react";
import { Task } from "./TaskColumn";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onSelect(task.id)}
      className={`group bg-gray-950 rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:border-gray-800 hover:shadow-lg hover:shadow-blue-500/5 ${
        isSelected
          ? "border-blue-600 ring-1 ring-blue-600/20 shadow-lg shadow-blue-500/10"
          : "border-gray-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <GripVertical
          size={14}
          className="text-gray-700 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing"
        />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm text-gray-100 leading-snug group-hover:text-white transition-colors duration-200">
              {task.title}
            </h3>
            <Flag
              size={14}
              className={`${getPriorityColor(
                task.priority
              )} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
              fill="currentColor"
            />
          </div>

          {task.description && (
            <p
              className="text-xs text-gray-500 leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded border transition-all duration-200 ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 transition-colors duration-200">
              {task.category}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-600 flex items-center gap-1 hover:text-gray-500 transition-colors duration-200">
                <Calendar size={11} />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 hover:bg-gray-900 rounded transition-all duration-200 hover:scale-110"
            >
              <Edit2
                size={13}
                className="text-gray-500 hover:text-blue-400 transition-colors duration-200"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 hover:bg-gray-900 rounded transition-all duration-200 hover:scale-110"
            >
              <Trash2
                size={13}
                className="text-gray-500 hover:text-red-400 transition-colors duration-200"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
