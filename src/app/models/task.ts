export interface Task {
    id: string;
    title: string;
    details: string;
    color: string; // which sticky-note color the user picked
    done: boolean;
    createdAt: number; // Date.now() — so we can sort newest first
}
// When we CREATE a task we do not have an id yet —
// Firestore generates it. So we omit it.
export type NewTask = Omit<Task, 'id'>;

export interface Stats {
  completedTotal: number;
  str: number;
  int: number;
  agi: number;
  vit: number;
}