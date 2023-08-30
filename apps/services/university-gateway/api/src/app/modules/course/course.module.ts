import { Module } from '@nestjs/common'
import { CourseResolver } from './course.resolver'

@Module({
  providers: [CourseResolver],
})

export class CourseModule {}
