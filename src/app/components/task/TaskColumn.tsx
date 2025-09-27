import { getStatusDotColor } from "@/app/utils/helpers";
import { TaskCard } from "./TaskCard";

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "ongoing" | "completed";
  dueDate: string;
  createdAt: string;
}

interface TaskColumnProps {
  status: Task["status"];
  tasks: Task[];
  selectedTask: number | null;
  onSelectTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStatus: Task["status"]) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  selectedTask,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className="space-y-3 min-h-[400px]"
    >
      <div className="flex items-center justify-between px-1 sticky top-[73px] bg-black/80 backdrop-blur-sm py-2 z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusDotColor(
              status
            )} animate-pulse`}
          ></div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            {status}
          </h2>
        </div>
        <span className="text-xs text-gray-600 bg-gray-950 px-2 py-0.5 rounded border border-gray-900">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-fadeIn"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <TaskCard
              task={task}
              isSelected={selectedTask === task.id}
              onSelect={onSelectTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 text-gray-700 text-sm animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-gray-900 mx-auto mb-3 flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}
              ></div>
            </div>
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
};
