import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { Course } from './model'

@Module({
  imports: [SequelizeModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
