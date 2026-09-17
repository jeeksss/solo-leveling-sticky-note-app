import { Component, computed, inject } from '@angular/core';
import { Task } from '../../services/task';
import { Stats, Task as TaskModel } from '../../models/task';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';


@Component({
  imports: [RouterLink],
  selector: 'app-task-board',
  styleUrl: './task-board.css',
  templateUrl: './task-board.html',
})
export class TaskBoard {
  
  private taskService = inject(Task);
  
  tasks = toSignal(this.taskService.getTasks(), { initialValue: [] as TaskModel[] });
  // derived state — recalculates itself whenever tasks() changes
  openCount = computed(() => this.tasks().filter(t => !t.done).length);
  totalCount = computed(() => this.tasks().length);

  async remove(id: string) {
    if (!confirm('Delete this task?')) return;
    await this.taskService.deleteTask(id);
  }

  // ---- COMPUTED SIGNALS FOR COLORS AND TASK COMPLETION ----
  private statsDoc = toSignal(this.taskService.getStats(), {
    initialValue: { completedTotal: 0, str: 0, int: 0, agi: 0, vit: 0 } as Stats
  });

  stats = computed(() => this.statsDoc() ?? { completedTotal: 0, str: 0, int: 0, agi: 0, vit: 0 });
  completedCount = computed(() => this.statsDoc()?.completedTotal ?? 0);
  level = computed(() => Math.floor(this.completedCount() / 5) + 1);
  progressPct = computed(() => ((this.completedCount() % 5) / 5) * 100);

  async complete(id: string, color: string) {
    await this.taskService.completeTask(id, color);
  }

  pendingTasks = computed(() => this.tasks().filter(t => !t.done));
  completedTasks = computed(() => this.tasks().filter(t => t.done));
}
