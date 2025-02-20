import { Module } from '@nestjs/common'
import { GrantsClientService } from './grant.service'
import { RannisGrantsClientModule } from '@island.is/clients/grants/rannis'

@Module({
  providers: [GrantsClientService, RannisGrantsClientModule],
  exports: [GrantsClientService],
})
export class GrantsClientModule {}
