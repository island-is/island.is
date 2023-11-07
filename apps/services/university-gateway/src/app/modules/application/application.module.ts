import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { Application } from './model/application'
import { ProgramModeOfDelivery, ProgramTable } from '../program'
import { University } from '../university'
import { ReykjavikUniversityApplicationClientModule } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClientModule } from '@island.is/clients/university-application/university-of-iceland'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Application,
      ProgramModeOfDelivery,
      ProgramTable,
      University,
    ]),
    ReykjavikUniversityApplicationClientModule,
    UniversityOfIcelandApplicationClientModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
