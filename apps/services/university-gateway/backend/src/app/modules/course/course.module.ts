import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { InternalCourseController } from './internalCourse.controller'
import { InternalCourseService } from './internalCourse.service'
import { Course } from './model'
import { University } from '../university/model'
import { Program, ProgramCourse } from '../program/model'

@Module({
  imports: [
    SequelizeModule.forFeature([University, Course, Program, ProgramCourse]),
  ],
  controllers: [InternalCourseController, CourseController],
  providers: [InternalCourseService, CourseService],
})
export class CourseModule {}
