import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'

@Module({
  providers: [
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    CommunicationsResolver,
    CommunicationsService,
    EmailService,
  ],
})
export class CommunicationsModule {}

//TODO: Add required healthchecks for this module
