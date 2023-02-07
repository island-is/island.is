import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/api/domains/auth'
import { IdentityModule } from '@island.is/api/domains/identity'
import { ClientsSessionsModule } from '@island.is/clients/sessions'

import { SessionsResolver } from './sessions.resolver'
import { SessionsService } from './services/sessions.service'

@Module({
  imports: [AuthModule, ClientsSessionsModule, IdentityModule],
  providers: [SessionsResolver, SessionsService],
  exports: [],
})
export class SessionsModule {}
