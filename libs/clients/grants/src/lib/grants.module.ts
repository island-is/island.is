import { Module } from '@nestjs/common'
import { GrantsClientService } from './grant.service'
import { RannisGrantService } from './clients/rannis/rannisGrants.service'

@Module({
  providers: [GrantsClientService, RannisGrantService],
  exports: [GrantsClientService],
})
export class GrantsClientModule {}
