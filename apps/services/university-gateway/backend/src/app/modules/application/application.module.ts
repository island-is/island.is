import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { InternalApplicationController } from './internalApplication.controller'
import { InternalApplicationService } from './internalApplication.service'
import { ConfigModule } from '@nestjs/config'
import { Application } from './model'
import { ProgramTable } from '../program/model'
import { University } from '../university/model'
import {
  ReykjavikUniversityApplicationClientConfig,
  ReykjavikUniversityApplicationClientModule,
} from '@island.is/clients/university-application/reykjavik-university'
import {
  UniversityOfIcelandApplicationClientConfig,
  UniversityOfIcelandApplicationClientModule,
} from '@island.is/clients/university-application/university-of-iceland'

@Module({
  imports: [
    SequelizeModule.forFeature([Application, ProgramTable, University]),
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
  controllers: [ApplicationController, InternalApplicationController],
  providers: [ApplicationService, InternalApplicationService],
})
export class ApplicationModule {}
