import { Module } from '@nestjs/common'

import {
  FamilyMemberResolver,
  UserResolver,
  ChildResolver,
  CorrectionResolver,
} from './resolvers'
import {
  NationalRegistryApi,
  NationalRegistrySoffiaClientConfig,
} from '@island.is/clients/national-registry-v1'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { ConfigType } from '@nestjs/config'
import { SoffiaService } from './services/v1/soffia.service'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [
    {
      provide: NationalRegistryApi,
      useFactory(
        config: ConfigType<typeof NationalRegistrySoffiaClientConfig>,
      ) {
        return NationalRegistryApi.instantiateClass(config)
      },
      inject: [NationalRegistrySoffiaClientConfig.KEY],
    },
    NationalRegistryService,
    UserResolver,
    FamilyMemberResolver,
    ChildResolver,
    CorrectionResolver,
    SoffiaService,
    NationalRegistryService,
  ],
})
export class NationalRegistryModule {}
