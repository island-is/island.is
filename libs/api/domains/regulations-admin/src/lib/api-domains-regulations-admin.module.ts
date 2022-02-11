import { DynamicModule, Module } from '@nestjs/common'
import {
  RegulationsAdminApi,
  RegulationsAdminOptions,
  REGULATIONS_ADMIN_OPTIONS,
} from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'
import { RegulationsService } from '@island.is/clients/regulations'
import { DownloadServiceConfig } from '@island.is/nest/config'

@Module({})
export class RegulationsAdminModule {
  static register(config: RegulationsAdminOptions): DynamicModule {
    return {
      module: RegulationsAdminModule,
      providers: [
        RegulationsAdminResolver,
        RegulationsAdminApi,
        {
          provide: REGULATIONS_ADMIN_OPTIONS,
          useValue: config,
        },
        {
          provide: RegulationsService,
          useFactory: async () =>
            new RegulationsService({ url: config.regulationsApiUrl }),
        },
        {
          provide: DownloadServiceConfig,
          useExisting: DownloadServiceConfig.KEY,
        },
      ],
      exports: [RegulationsService, RegulationsAdminApi],
    }
  }
}
