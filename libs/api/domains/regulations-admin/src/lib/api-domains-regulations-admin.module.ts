import { DynamicModule, Module } from '@nestjs/common'
import {
  RegulationsAdminApi,
  RegulationsAdminOptions,
  REGULATIONS_ADMIN_OPTIONS,
} from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'
import { RegulationsService } from '@island.is/clients/regulations'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({})
export class RegulationsAdminModule {
  static register(config: RegulationsAdminOptions): DynamicModule {
    return {
      module: RegulationsAdminModule,
      providers: [
        RegulationsAdminResolver,
        {
          provide: REGULATIONS_ADMIN_OPTIONS,
          useValue: config,
        },
        RegulationsAdminApi,
        {
          provide: RegulationsService,
          useFactory: async () =>
            new RegulationsService({ url: config.regulationsApiUrl }),
        },
      ],
      imports: [
        NationalRegistryXRoadModule.register(config.nationalRegistryXRoad),
      ],
    }
  }
}
