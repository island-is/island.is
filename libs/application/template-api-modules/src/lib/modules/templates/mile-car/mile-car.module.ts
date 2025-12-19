import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { MileCarService } from './mile-car.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import { ConfigModule } from '@nestjs/config'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclesClientConfig],
    }),
  ],
  providers: [MileCarService],
  exports: [MileCarService],
})
export class MileCarModule {}
