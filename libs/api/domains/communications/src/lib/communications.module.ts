import { Module } from '@nestjs/common'

import {
  ZendeskModule,
  ZendeskServiceOptions,
} from '@island.is/clients/zendesk'
import { EmailModule, EmailServiceOptions } from '@island.is/email-service'

import { environment } from './environments/environment'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions as EmailServiceOptions),
    ZendeskModule.register(environment.zendeskOptions as ZendeskServiceOptions),
  ],
  providers: [CommunicationsResolver, CommunicationsService],
})
export class CommunicationsModule {}
