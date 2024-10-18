import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models/application.model'
import { EmailModule } from '@island.is/email-service'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import {
  AmountModule,
  MunicipalityModule,
  FileModule,
  StaffModule,
  ApplicationEventModule,
  DirectTaxPaymentModule,
  ChildrenModule,
} from '../index'

@Module({
  imports: [
    forwardRef(() => StaffModule),
    forwardRef(() => FileModule),
    EmailModule,
    forwardRef(() => ApplicationEventModule),
    forwardRef(() => ChildrenModule),
    forwardRef(() => MunicipalityModule),
    forwardRef(() => AmountModule),
    forwardRef(() => DirectTaxPaymentModule),
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
