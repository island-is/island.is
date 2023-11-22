import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Program } from './model/program'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { Course } from '../course/model/course'
import { University } from '../university/model/university'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      Program,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
