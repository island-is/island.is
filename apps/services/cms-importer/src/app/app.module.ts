import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppRepository } from './app.repository'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from './modules/managementClient/managementClient.config'
import { ManagementClientModule } from './modules/managementClient/managementClient.module'
import { GrantsClientModule } from '@island.is/clients/grants'

@Module({
  imports: [
    LoggingModule,
    GrantsClientModule,
    ManagementClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [AppService, AppRepository],
})
export class AppModule {}
