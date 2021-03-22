import { EmailModule } from '@island.is/email-service'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'

@Module({
  imports: [EmailModule.register(environment.emailOptions)],
  providers: [CommunicationsResolver, CommunicationsService],
})
export class CommunicationsModule {}
