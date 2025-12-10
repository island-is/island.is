import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwksClientProvider } from './guards/jwks.guard'
import { ConfigModule } from '@nestjs/config'
import { AppConfig } from './app.config'
import { EmailModule, emailModuleConfig } from '@island.is/email-service'
import { LandspitaliService } from './landspitali.service'

@Module({
  imports: [
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, emailModuleConfig],
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwksClientProvider, LandspitaliService],
})
export class AppModule {}
