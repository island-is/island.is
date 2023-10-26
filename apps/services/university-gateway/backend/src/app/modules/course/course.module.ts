import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { InternalCourseController } from './internalCourse.controller'
import { InternalCourseService } from './internalCourse.service'
import { Course } from './model'
import { University } from '../university/model'
import { ProgramCourse, ProgramTable } from '../program/model'
import {
  ReykjavikUniversityApplicationClientConfig,
  ReykjavikUniversityApplicationClientModule,
} from '@island.is/clients/university-application/reykjavik-university'
import {
  UniversityOfIcelandApplicationClientConfig,
  UniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/university-of-iceland'
import { ConfigModule } from '@nestjs/config'
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
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        ReykjavikUniversityApplicationClientConfig,
        UniversityOfIcelandApplicationClientConfig,
      ],
    }),
  ],
  controllers: [InternalCourseController, CourseController],
  providers: [InternalCourseService, CourseService],
})
export class CourseModule {}
