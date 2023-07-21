import { Module } from '@nestjs/common'
import { NationalRegistryV3Service } from './services/v3/nationalRegistryV3.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { NationalRegistryResolver } from './nationalRegistry.resolver'
import { NationalRegistryXRoadService } from './services/v2/nationalRegistryXRoad.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import {
  NationalRegistryApi,
  NationalRegistrySoffiaClientConfig,
} from '@island.is/clients/national-registry-v1'
import { ConfigType } from '@nestjs/config'

@Module({
  imports: [NationalRegistryV3ClientModule, NationalRegistryClientModule],
  providers: [
    NationalRegistryResolver,
    NationalRegistryXRoadService,
    NationalRegistryV3Service,
    {
      provide: NationalRegistryApi,
      // See method doc for disable reason.
      // eslint-disable-next-line local-rules/no-async-module-init
      useFactory: async (
        config: ConfigType<typeof NationalRegistrySoffiaClientConfig>,
      ) => {
        NationalRegistryApi.instantiateClass(config)
      },
      inject: [NationalRegistrySoffiaClientConfig.KEY],
    },
  ],
})
export class NationalRegistryModule {}
