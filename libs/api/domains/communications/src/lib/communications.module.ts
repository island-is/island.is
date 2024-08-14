import { EmailModule } from '@island.is/email-service'
import {
  ZendeskModule,
  ZendeskServiceOptions,
} from '@island.is/clients/zendesk'
import { Module } from '@nestjs/common'
import { CommunicationsResolver } from './communications.resolver'
import { CommunicationsService } from './communications.service'
import { environment } from './environments/environment'
import { CmsModule } from '@island.is/cms'
import { FileStorageModule } from '@island.is/file-storage'

@Module({
  imports: [
    EmailModule,
    ZendeskModule.register(environment.zendeskOptions as ZendeskServiceOptions),
    CmsModule,
    FileStorageModule,
  ],
  providers: [CommunicationsResolver, CommunicationsService],
})
export class CommunicationsModule {}
