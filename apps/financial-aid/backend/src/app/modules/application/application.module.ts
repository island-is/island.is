import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models/application.model'
import { EmailModule } from '@island.is/email-service'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { environment } from '../../../environments'
import {
  AmountModule,
  MunicipalityModule,
  FileModule,
  StaffModule,
  ApplicationEventModule,
} from '../index'

@Module({
  imports: [
    forwardRef(() => StaffModule),
    forwardRef(() => FileModule),
    EmailModule.register(environment.emailOptions),
    forwardRef(() => ApplicationEventModule),
    forwardRef(() => MunicipalityModule),
    forwardRef(() => AmountModule),
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
