import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppRepository } from './app.repository'
import { GrantsClientModule } from '@island.is/clients/grants'

@Module({
  imports: [LoggingModule, GrantsClientModule],
  providers: [AppService, AppRepository],
})
export class AppModule {}
