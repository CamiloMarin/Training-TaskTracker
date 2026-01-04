import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TaskService } from './task/task.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const taskService = app.get(TaskService);

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'add':
      await taskService.add(args.slice(1).join(' '));
      break;

      case 'list': {
        const status = args[1] as 'todo' | 'in-progress' | 'done' | undefined;
        taskService.list(status);
        break;
      }

    case 'delete': {
      const id = Number(args[1]);
      if (isNaN(id)) {
        console.log('❌ Debes pasar un id válido');
        break;
      }
      taskService.delete(id);
      break;
    }

    case 'update': {
      const id = Number(args[1]);
      const description = args.slice(2).join(' ');

      if (isNaN(id) || !description) {
        console.log('❌ Uso correcto: update <id> <nueva descripción>');
        break;
      }

      taskService.update(id, description);
      break;
    }


    case 'status': {
      const id = Number(args[1]);
      const status = args[2];

      if (isNaN(id) || !status) {
        console.log('❌ Uso correcto: status <id> <todo|in-progress|done>');
        break;
      }

      taskService.updateStatus(id, status);
      break;
    }

    case 'toggle': {
      const id = Number(args[1]);

      if (isNaN(id)) {
        console.log('❌ Uso correcto: toggle <id>');
        break;
      }

      taskService.toggle(id);
      break;
    }

    case 'stats':
    taskService.stats();
    break;


    default:
      console.log('Comando no reconocido');
  }



  await app.close();
}

bootstrap();
