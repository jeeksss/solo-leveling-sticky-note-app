import { Routes } from '@angular/router';
import { TaskBoard } from './features/task-board/task-board';
import { TaskCreate } from './features/task-create/task-create';
import { TaskEdit } from './features/task-edit/task-edit';

export const routes: Routes = [

    {path: '', redirectTo: 'tasks', pathMatch: 'full'},
    {path: 'tasks', component: TaskBoard},
    {path: 'tasks/new', component: TaskCreate},
    {path: 'tasks/:id/edit', component: TaskEdit},
    {path: '**', redirectTo: 'tasks'},
];
