import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const VALID_STATUSES = ['todo', 'in-progress', 'done'] as const;
type TaskStatus = typeof VALID_STATUSES[number];

@Injectable()
export class TaskService {
  private filePath = path.join(process.cwd(), 'tasks.json');

  // ----------------------------------- Lectura y creación de tareas

  // Leer tareas

  private readTasks() {
    if (!fs.existsSync(this.filePath)) return [];
    return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
  }

  // Guardar tareas

  private saveTasks(tasks) {
    fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2));
  }

  // Añadir Tarea

  add(description: string) {
    const tasks = this.readTasks();
    const task = {
      id: Date.now(),
      description,
      status: 'todo',
      createdAt: new Date(),
    };

    tasks.push(task);
    this.saveTasks(tasks);
    console.log('✅ Tarea agregada');
  }

  // ----------------------------------- Escritura

  // Delete

  delete(id: number) {
    const tasks = this.readTasks();

    const filtered = tasks.filter(task => task.id !== id);

    if (tasks.length === filtered.length) {
      console.log('❌ Tarea no encontrada');
      return;
    }

    this.saveTasks(filtered);
    console.log('🗑️ Tarea eliminada');
  }

  // Update

  update(id: number, description: string) {
    const tasks = this.readTasks();

    const task = tasks.find(t => t.id === id);

    if (!task) {
      console.log('❌ Tarea no encontrada');
      return;
    }

    task.description = description;

    this.saveTasks(tasks);
    console.log('✏️ Tarea actualizada');
  }

  // Update status
  updateStatus(id: number, status: string) {
    const tasks = this.readTasks();
    const task = tasks.find(t => t.id === id);

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      console.log('❌ Estado inválido. Usa: todo | in-progress | done');
      return;
    }

    if (!task) {
      console.log('❌ Tarea no encontrada');
      return;
    }

    task.status = status;

    this.saveTasks(tasks);
    console.log(`🔄 Estado actualizado a "${status}"`);
  }

  // Toggle status : cambuia el status de un estado sin necesidad de copiar el estado especifico.

  toggle(id: number) {
  const tasks = this.readTasks();

  const task = tasks.find(t => t.id === id);

  if (!task) {
    console.log('❌ Tarea no encontrada');
    return;
  }

  switch (task.status) {
    case 'todo':
      task.status = 'in-progress';
      break;

    case 'in-progress':
      task.status = 'done';
      break;

    case 'done':
      task.status = 'todo';
      break;

    default:
      task.status = 'todo';
  }

  this.saveTasks(tasks);
  console.log(`🔁 Estado cambiado a "${task.status}"`);
}

  // Stats
  stats() {
  const tasks = this.readTasks();

  const stats = {
    total: tasks.length,
    todo: 0,
    'in-progress': 0,
    done: 0,
  };

  for (const task of tasks) {
    if (stats[task.status] !== undefined) {
      stats[task.status]++;
    }
  }

  console.log('📊 Estadísticas');
  console.log(`Total: ${stats.total}`);
  console.log(`⏳ Todo: ${stats.todo}`);
  console.log(`🚧 In-progress: ${stats['in-progress']}`);
  console.log(`✅ Done: ${stats.done}`);
}

  // remove --done
  removeDone() {
  const tasks = this.readTasks();

  const doneTasks = tasks.filter(t => t.status === 'done');

  if (!doneTasks.length) {
    console.log('ℹ️ No hay tareas completadas para eliminar');
    return;
  }

  const remaining = tasks.filter(t => t.status !== 'done');

  this.saveTasks(remaining);

  console.log(`🧹 ${doneTasks.length} tarea(s) completada(s) eliminada(s)`);
} 

  // Enlistar tareas

  list(status?: 'todo' | 'in-progress' | 'done') {
    let tasks = this.readTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
  
    if (!tasks.length) {
      console.log('No hay tareas');
      return;
    }
    const icons = {
      todo: '⏳',
      'in-progress': '🚧',
      done: '✅',
    };

    tasks.forEach(t =>
      console.log(`${icons[t.status]} [${t.status}] ${t.id}: ${t.description}`)
    );
  }


}
