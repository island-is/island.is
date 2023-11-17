import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Tag } from './model/tag'
import { Program } from './model/program'
import { ProgramTag } from './model/programTag'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { Course } from '../course/model/course'
import { University } from '../university/model/university'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      Tag,
      Program,
      ProgramTag,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
