import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { InternalProgramController } from './internalProgram.controller'
import { InternalProgramService } from './internalProgram.service'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  Program,
  // ProgramCourse,
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTag,
  Tag,
} from './model'
import { Course } from '../course/model'
import { University } from '../university/model'
import {
  UgReykjavikUniversityClientConfig,
  UgReykjavikUniversityClientModule,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      Program,
      // ProgramCourse,
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
  controllers: [InternalProgramController, ProgramController],
  providers: [InternalProgramService, ProgramService],
})
export class ProgramModule {}
