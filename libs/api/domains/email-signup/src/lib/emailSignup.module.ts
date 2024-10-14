import { Module } from '@nestjs/common'

import { CmsModule } from '@island.is/cms'

import { EmailSignupResolver } from './emailSignup.resolver'
import { EmailSignupService } from './emailSignup.service'
import { ZenterSignupService } from './services/zenter/zenter.service'
import { MailchimpSignupService } from './services/mailchimp/mailchimp.service'
import { CampaignMonitorSignupService } from './services/campaignMonitor/campaignMonitor.service'

@Module({
  imports: [CmsModule],
  providers: [
    ZenterSignupService,
    MailchimpSignupService,
    CampaignMonitorSignupService,
    EmailSignupService,
    EmailSignupResolver,
  ],
})
export class EmailSignupModule {}
