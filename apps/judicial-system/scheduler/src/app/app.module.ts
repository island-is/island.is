import { Module } from '@nestjs/common'

import { ConfigModule } from '@island.is/nest/config'

import { appModuleConfig } from './app.config'
import { AppService } from './app.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [appModuleConfig] })],
  providers: [AppService],
})
export class AppModule {}
