import { Module } from '@nestjs/common'
import { MinistryOfJusticeResolver } from './ministryOfJustice.resolver'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { DmrClientService, DefaultApi as DmrApi } from '@island.is/clients/dmr'

@Module({
  providers: [
    MinistryOfJusticeResolver,
    MinistryOfJusticeService,
    DmrApi,
    DmrClientService,
  ],
  exports: [MinistryOfJusticeService],
})
export class MinistryOfJusticeModule {}
