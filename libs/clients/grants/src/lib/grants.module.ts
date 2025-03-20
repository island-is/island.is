import { Module } from '@nestjs/common'
import { GrantsClientService } from './grant.service'
import { RannisGrantsClientModule } from './clients/rannis/rannisGrants.module'

@Module({
  imports: [RannisGrantsClientModule],
  providers: [GrantsClientService],
  exports: [GrantsClientService],
})
export class GrantsClientModule {}
