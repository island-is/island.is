import { Module } from '@nestjs/common'
import { ExampleController } from './example.controller'
import { ExampleService } from './example.service'
import {
  UgReykjavikUniversityClientModule,
  UgReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from '../university/model'
import { Course } from '../course/model'
import {
  Program,
  ProgramCourse,
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTag,
  Tag,
} from '../program/model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      Program,
      ProgramCourse,
      ProgramTag,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
    UgReykjavikUniversityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UgReykjavikUniversityClientConfig],
    }),
  ],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
