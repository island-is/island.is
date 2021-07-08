import { DynamicModule, Module } from '@nestjs/common'
import {
  RegulationsAdminApi,
  RegulationsAdminOptions,
  REGULATIONS_ADMIN_OPTIONS,
} from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'

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
      ],
    }
  }
}
