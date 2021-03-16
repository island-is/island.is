import { EmailModule } from '@island.is/email-service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'

@Module({
  imports: [EmailModule.register(environment.emailOptions)],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    CommunicationsResolver,
    CommunicationsService,
  ],
})
export class CommunicationsModule {}
