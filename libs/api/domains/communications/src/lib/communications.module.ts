import { EmailModule } from '@island.is/email-service'
import { ZendeskModule } from '@island.is/clients/zendesk'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    ZendeskModule.register(environment.zendeskOptions),
  ],
  providers: [CommunicationsResolver, CommunicationsService],
})
export class CommunicationsModule {}
