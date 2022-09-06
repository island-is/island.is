import { Module } from '@nestjs/common'
import { MailchimpResolver } from './mailchimp.resolver'
import { CmsModule } from '@island.is/cms'

@Module({
  imports: [CmsModule],
  providers: [MailchimpResolver],
})
export class MailchimpModule {}
