import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { InternalCourseController } from './internalCourse.controller'
import { InternalCourseService } from './internalCourse.service'
import { Course } from './model'
import { University } from '../university/model'
import { Program, ProgramCourse } from '../program/model'
import {
  UniversityGatewayReykjavikUniversityClientConfig,
  UniversityGatewayReykjavikUniversityClientModule,
} from '@island.is/clients/university-gateway/reykjavik-university'
import {
  UniversityGatewayUniversityOfIcelandClientConfig,
  UniversityGatewayUniversityOfIcelandClientModule,
} from '@island.is/clients/university-gateway/university-of-iceland'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SequelizeModule.forFeature([University, Course, Program, ProgramCourse]),
    UniversityGatewayReykjavikUniversityClientModule,
    UniversityGatewayUniversityOfIcelandClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        UniversityGatewayReykjavikUniversityClientConfig,
        UniversityGatewayUniversityOfIcelandClientConfig,
      ],
    }),
  ],
  controllers: [InternalCourseController, CourseController],
  providers: [InternalCourseService, CourseService],
})
export class CourseModule {}
