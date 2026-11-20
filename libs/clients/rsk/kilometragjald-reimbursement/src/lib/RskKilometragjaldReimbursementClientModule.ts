import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { RskKilometragjaldReimbursementConfigurationProvider } from './apiConfiguration'
import { RskKilometragjaldReimbursementClient } from './RskKilometragjaldReimbursementClient'
import { RskKilometragjaldReimbursementClientConfig } from './RskKilometragjaldReimbursementClientConfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [RskKilometragjaldReimbursementClientConfig, XRoadConfig],
    }),
  ],
  providers: [
    RskKilometragjaldReimbursementClient,
    RskKilometragjaldReimbursementConfigurationProvider,
  ],
  exports: [RskKilometragjaldReimbursementClient],
})
export class RskKilometragjaldReimbursementClientModule {}
