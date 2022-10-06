import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'

@Module({
  imports: [AuthDelegationsModule],
  controllers: [],
  providers: [],
})
export class DomainsModule {}
