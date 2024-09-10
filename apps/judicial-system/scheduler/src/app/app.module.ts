import { Module } from '@nestjs/common'

import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  MessageModule,
  messageModuleConfig,
} from '@island.is/judicial-system/message'

import { appModuleConfig } from './app.config'
import { AppService } from './app.service'

@Module({
  imports: [
    LoggingModule,
    MessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [messageModuleConfig, appModuleConfig],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
