import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { InternalCourseController } from './internalCourse.controller'
import { InternalCourseService } from './internalCourse.service'
import { Course } from './model'
import { University } from '../university/model'
import { ProgramCourse, ProgramMinor, ProgramTable } from '../program/model'
import {
  ReykjavikUniversityApplicationClientConfig,
  ReykjavikUniversityApplicationClientModule,
} from '@island.is/clients/university-application/reykjavik-university'
import {
  UniversityOfIcelandApplicationClientConfig,
  UniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/university-of-iceland'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      ProgramTable,
      ProgramCourse,
      ProgramMinor,
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
