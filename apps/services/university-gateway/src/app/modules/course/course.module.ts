import { Module } from '@nestjs/common'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'

@Module({
  imports: [],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
