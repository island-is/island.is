import { DynamicModule, Module } from '@nestjs/common'
import { RegulationsAdminApi } from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'
import { RegulationsService } from '@island.is/clients/regulations'
import { RegulationsAdminClientModule } from '@island.is/clients/regulations-admin'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
  presignedKey: string
  publishKey: string
  draftKey: string
}
@Module({})
export class RegulationsAdminModule {
  static register(config: RegulationsAdminOptions): DynamicModule {
    return {
      module: RegulationsAdminModule,
      imports: [RegulationsAdminClientModule],
      providers: [
        RegulationsAdminResolver,
        RegulationsAdminApi,
        {
          provide: RegulationsService,
          // See method doc for disable reason.
          // eslint-disable-next-line local-rules/no-async-module-init
          useFactory: async () =>
            new RegulationsService({
              url: config.regulationsApiUrl,
              presignedKey: config.presignedKey,
              publishKey: config.publishKey,
              draftKey: config.draftKey,
            }),
        },
      ],
      exports: [RegulationsService, RegulationsAdminApi],
    }
  }
}
