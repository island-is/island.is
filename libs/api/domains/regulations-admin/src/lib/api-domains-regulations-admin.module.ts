import { DynamicModule, Module } from '@nestjs/common'
import { RegulationsAdminApi } from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'
import { RegulationsService } from '@island.is/clients/regulations'
import { RegulationsAdminClientModule } from '@island.is/clients/regulations-admin'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
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
          useFactory: async () =>
            new RegulationsService({
              url: config.regulationsApiUrl,
              // Regulations admin does not need file uploads
              publishKey: '',
              draftKey: '',
              presignedKey: '',
            }),
        },
      ],
      exports: [RegulationsService, RegulationsAdminApi],
    }
  }
}
