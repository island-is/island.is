import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { MailService } from './mail.service'

@Module({
  providers: [CommunicationsResolver, MailService],
})
export class CommunicationsModule { }

//TODO: Add required healthchecks for this module
