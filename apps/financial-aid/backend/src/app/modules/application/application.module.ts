import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models'
import { ApplicationEventModule } from '../applicationEvent'
import { EmailModule } from '@island.is/email-service'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileModule } from '../file'
import { environment } from '../../../environments'
import { StaffModule } from '../staff'
import { MunicipalityModule } from '../municipality'
import { AmountModule } from '../amount'

@Module({
  imports: [
    FileModule,
    EmailModule.register(environment.emailOptions),
    ApplicationEventModule,
    SequelizeModule.forFeature([ApplicationModel]),
    StaffModule,
    MunicipalityModule,
    AmountModule,
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
