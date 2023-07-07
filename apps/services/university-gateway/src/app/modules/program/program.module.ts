import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import {
  UgReykjavikUniversityClientModule,
  UgReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
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
    UgReykjavikUniversityClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UgReykjavikUniversityClientConfig],
    }),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
