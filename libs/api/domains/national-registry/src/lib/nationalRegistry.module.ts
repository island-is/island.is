import { Module } from '@nestjs/common'

import {
  NationalRegistryApi,
  NationalRegistrySoffiaClientConfig,
} from '@island.is/clients/national-registry-v1'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { ConfigType } from '@nestjs/config'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'
import {
  UserResolver,
  FamilyMemberResolver,
  ChildResolver,
  CorrectionResolver,
  PersonResolver,
  ChildCustodyResolver,
} from './resolvers'

@Module({
  imports: [NationalRegistryV3ClientModule],
  providers: [
    {
      provide: NationalRegistryApi,
      useFactory(
        config: ConfigType<typeof NationalRegistrySoffiaClientConfig>,
      ) {
        if (config) {
          return NationalRegistryApi.instantiateClass(config)
        }
      },
      inject: [NationalRegistrySoffiaClientConfig.KEY],
    },
    SoffiaService,
    BrokerService,
    NationalRegistryService,
    UserResolver,
    ChildCustodyResolver,
    PersonResolver,
    FamilyMemberResolver,
    ChildResolver,
    CorrectionResolver,
  ],
})
export class NationalRegistryModule {}
