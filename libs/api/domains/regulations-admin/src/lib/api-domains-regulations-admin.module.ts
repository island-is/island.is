import { DynamicModule, Module } from '@nestjs/common'
import { RegulationsAdminApi } from './client'
import { RegulationsAdminResolver } from './graphql/regulationsAdmin.resolver'
import { RegulationsService } from '@island.is/clients/regulations'
import {
  RegulationsAdminClientModule,
  RegulationsAdminClientService,
} from '@island.is/clients/regulations-admin'

@Module({
  imports: [RegulationsAdminClientModule],
  providers: [
    RegulationsAdminResolver,
    RegulationsAdminClientService,
    RegulationsAdminApi,
    RegulationsService,
  ],
  exports: [
    RegulationsService,
    RegulationsAdminApi,
    RegulationsAdminClientService,
  ],
})
export class RegulationsAdminModule {}
