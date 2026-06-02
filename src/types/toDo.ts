export interface ToDo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type ToDoFilter = "all"| "pending" | "completed";