import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models/application.model'
import { ApplicationEventModule } from '../applicationEvent'
import { StaffModule } from '../staff'
import { EmailModule } from '@island.is/email-service'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileModule } from '../file'
import { environment } from '../../../environments'
import { MunicipalityModule } from '../municipality'
import { AmountModule } from '../amount'

@Module({
  imports: [
    StaffModule,
    FileModule,
    EmailModule.register(environment.emailOptions),
    ApplicationEventModule,
    MunicipalityModule,
    AmountModule,
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
