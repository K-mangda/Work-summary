export type Status = "todo" | "doing" | "done" | "blocked";
export const STATUSES: Status[] = ["todo", "doing", "done", "blocked"];

export interface Subtask {
  title: string;
  checked: boolean;
  note?: string;
}
export interface Task {
  id: string;
  title: string;
  status: Status;
  checked: boolean;
  result?: string;
  notes?: string;
  tags?: string[];
  subtasks?: Subtask[];
  compare?: { before: string; after: string; caption?: string };
}
/** หมวดงาน เช่น Blog, OnesiamFactory > Backoffice (ซ้อนกันได้หลายชั้น) */
export interface Group {
  name: string;
  tasks?: Task[];
  groups?: Group[];
}
export interface Day {
  date: string;
  summary?: string;
  groups: Group[];
}

export const groupTasks = (g: Group): Task[] => [
  ...(g.tasks ?? []),
  ...(g.groups ?? []).flatMap(groupTasks),
];
export const dayTasks = (d: Day): Task[] => d.groups.flatMap(groupTasks);
