import { Module } from '@nestjs/common'
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
    RegulationsService,
  ],
  exports: [RegulationsService, RegulationsAdminClientService],
})
export class RegulationsAdminModule {}
