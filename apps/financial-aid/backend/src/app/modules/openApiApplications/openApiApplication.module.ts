import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailModule } from '@island.is/email-service'
import { OpenApiApplicationController } from './openApiApplication.controller'
import { OpenApiApplicationService } from './openApiApplication.service'
import { environment } from '../../../environments'
import {
  AmountModule,
  MunicipalityModule,
  FileModule,
  StaffModule,
  ApplicationEventModule,
  DirectTaxPaymentModule,
} from '../index'
import { ApplicationModel } from '../application/models'

@Module({
  imports: [
    forwardRef(() => StaffModule),
    forwardRef(() => FileModule),
    EmailModule.register(environment.emailOptions),
    forwardRef(() => ApplicationEventModule),
    forwardRef(() => MunicipalityModule),
    forwardRef(() => AmountModule),
    forwardRef(() => DirectTaxPaymentModule),
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [OpenApiApplicationService],
  controllers: [OpenApiApplicationController],
  exports: [OpenApiApplicationService],
})
export class OpenApiApplicationModule {}
