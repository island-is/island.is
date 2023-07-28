import { Module } from '@nestjs/common'

import {
  FamilyMemberResolver,
  UserResolver,
  ChildResolver,
  CorrectionResolver,
} from './graphql'
import {
  NationalRegistryApi,
  NationalRegistrySoffiaClientConfig,
} from '@island.is/clients/national-registry-v1'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { ConfigType } from '@nestjs/config'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [
    NationalRegistryService,
    UserResolver,
    FamilyMemberResolver,
    ChildResolver,
    CorrectionResolver,
    {
      provide: NationalRegistryApi,
      useFactory(
        config: ConfigType<typeof NationalRegistrySoffiaClientConfig>,
      ) {
        return NationalRegistryApi.instantiateClass(config)
      },
      inject: [NationalRegistrySoffiaClientConfig.KEY],
    },
  ],
  exports: [NationalRegistryService],
})
export class NationalRegistryModule {}
