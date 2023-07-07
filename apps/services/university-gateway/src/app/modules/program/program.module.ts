import { Module } from '@nestjs/common'
import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import {
  UgReykjavikUniversityClientModule,
  UgReykjavikUniversityClientConfig,
} from '@island.is/clients/university-gateway/reykjavik-university'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Program } from './model'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramTag } from './model/programTag'
import { University } from '../university/model'
import { Tag } from './model/tag'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Program,
      ProgramModeOfDelivery,
      ProgramTag,
      University,
      Tag,
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
