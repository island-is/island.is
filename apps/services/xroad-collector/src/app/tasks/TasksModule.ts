import { Module } from '@nestjs/common';
import { TasksService } from './TasksService';

@Module({
  providers: [TasksService],
})
export class TasksModule {}