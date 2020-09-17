import { DataSourceConfig } from 'apollo-datasource'

import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService, SmsServiceOptions } from '@island.is/nova-sms'

import { environment } from '../../../environments'
import { AuthModule } from '../auth'
import { Case } from './models'
import { CaseController } from './case.controller'
import { CaseService } from './case.service'

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Case])],
  controllers: [CaseController],
  providers: [
    CaseService,
    {
      provide: 'SMS_OPTIONS',
      useValue: environment.smsOptions,
    },
    {
      provide: SmsService,
      useFactory: (options: SmsServiceOptions, logger: Logger) => {
        const smsService = new SmsService(options, logger)
        smsService.initialize({} as DataSourceConfig<{}>)
        return smsService
      },
      inject: ['SMS_OPTIONS', LOGGER_PROVIDER],
    },
  ],
})
export class CaseModule {}
