import { Module } from '@nestjs/common'

import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

import { IdentityClientService } from './identityClient.service'

@Module({
  imports: [NationalRegistryClientModule, CompanyRegistryClientModule],
  providers: [IdentityClientService],
  exports: [IdentityClientService],
})
export class IdentityClientModule {}
