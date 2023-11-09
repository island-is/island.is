import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { Course } from './model/course'
import { University } from '../university'
import { ProgramCourse, ProgramTable } from '../program'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../../../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forFeature([
      University,
      Course,
      ProgramTable,
      ProgramCourse,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
