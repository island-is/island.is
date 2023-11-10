import { Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'

import { IdentityClientService } from './identityClient.service'

@Module({
  imports: [
    NationalRegistryClientModule,
    NationalRegistryV3ClientModule,
    CompanyRegistryClientModule,
  ],
  providers: [IdentityClientService],
  exports: [IdentityClientService],
})
export class IdentityClientModule {}
