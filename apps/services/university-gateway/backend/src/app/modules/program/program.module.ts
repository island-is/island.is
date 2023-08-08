import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  Program,
  ProgramExtraApplicationField,
  ProgramModeOfDelivery,
  ProgramTag,
  Tag,
} from './model'
import { Course } from '../course/model'

@Module({
  imports: [
    SequelizeModule.forFeature([
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
