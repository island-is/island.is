import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Program } from './model/program'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { University } from '../university/model/university'

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Program,
      ProgramModeOfDelivery,
      ProgramExtraApplicationField,
    ]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
