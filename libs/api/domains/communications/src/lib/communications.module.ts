import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
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
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    CommunicationsResolver,
    CommunicationsService,
    EmailService,
  ],
})
export class CommunicationsModule {}
