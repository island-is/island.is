import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppRepository } from './app.repository'

@Module({
  imports: [LoggingModule],
  providers: [AppService, AppRepository],
})
export class AppModule {}
