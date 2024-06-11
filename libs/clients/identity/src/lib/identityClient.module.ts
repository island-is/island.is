import { Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { IdentityClientService } from './identityClient.service'
import {
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
} from '@island.is/clients/national-registry-v3'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    NationalRegistryClientModule,
    CompanyRegistryClientModule,
    NationalRegistryV3ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryV3ClientConfig, IdsClientConfig, XRoadConfig],
    }),
  ],
  providers: [IdentityClientService],
  exports: [IdentityClientService],
})
export class IdentityClientModule {}
