import { EmailModule, EmailServiceOptions } from '@island.is/email-service'
import {
  ZendeskModule,
  ZendeskServiceOptions,
} from '@island.is/clients/zendesk'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions as EmailServiceOptions),
    ZendeskModule.register(environment.zendeskOptions as ZendeskServiceOptions),
  ],
  providers: [CommunicationsResolver, CommunicationsService],
})
export class CommunicationsModule {}
