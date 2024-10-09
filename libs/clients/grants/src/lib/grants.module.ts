import { Module } from '@nestjs/common'
import { RannisGrantService } from './clients/rannis/src'
import { GrantService } from './grants.service'
import { GRANT_PROVIDER_FACTORY } from './grants.types'

@Module({
  providers: [
    GrantService,
    {
      provide: GRANT_PROVIDER_FACTORY,
      useClass: RannisGrantService,
    },
  ],
  exports: [GrantService],
})
export class ClientsGrantsModule {}
