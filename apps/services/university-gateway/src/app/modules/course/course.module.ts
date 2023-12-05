import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { Course } from './model/course'
import { University } from '../university/model/university'
import { ProgramCourse } from '../program/model/programCourse'
import { Program } from '../program/model/program'

@Module({
  imports: [
    SequelizeModule.forFeature([University, Course, Program, ProgramCourse]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
