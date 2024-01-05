import { Module } from '@nestjs/common'

import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  MessageModule,
  messageModuleConfig,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { HealthController } from './health.controller'
import { InternalDeliveryService } from './internalDelivery.service'
import { MessageHandlerService } from './messageHandler.service'

@Module({
  imports: [
    LoggingModule,
    MessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [messageModuleConfig, appModuleConfig],
    }),
  ],
  controllers: [HealthController],
  providers: [InternalDeliveryService, MessageHandlerService],
})
export class AppModule {}
