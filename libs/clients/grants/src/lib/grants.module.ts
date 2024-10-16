import { Module } from '@nestjs/common'
import { RannisGrantService } from './clients/rannis/src/lib/rannisGrants.service'
import { GrantsService } from './grants.service'

@Module({
  providers: [GrantsService, RannisGrantService],
  exports: [GrantsService],
})
export class GrantsClientModule {}
