import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppRepository } from './app.repository'
import { AppService } from './app.service'

@Module({
  imports: [LoggingModule],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}
