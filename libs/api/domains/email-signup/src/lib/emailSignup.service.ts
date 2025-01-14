import { Injectable } from '@nestjs/common'

import { CmsContentfulService } from '@island.is/cms'

import { MailchimpSignupService } from './services/mailchimp/mailchimp.service'
import { ZenterSignupService } from './services/zenter/zenter.service'
import { CampaignMonitorSignupService } from './services/campaignMonitor/campaignMonitor.service'
import { EmailSignupInput } from './dto/emailSignup.input'

enum SignupType {
  Mailchimp = 'mailchimp',
  Zenter = 'zenter',
  CampaignMonitor = 'campaign monitor',
}

@Injectable()
export class EmailSignupService {
  constructor(
    private readonly zenterSignupService: ZenterSignupService,
    private readonly mailchimpSignupService: MailchimpSignupService,
    private readonly campaignMonitorSignupService: CampaignMonitorSignupService,
    private readonly cmsContentfulService: CmsContentfulService,
  ) {}

  async subscribeToMailingList(input: EmailSignupInput) {
    const emailSignupModel = await this.cmsContentfulService.getEmailSignup({
      id: input.signupID,
    })

    if (!emailSignupModel) return { subscribed: false }

    const formFieldNames =
      emailSignupModel.formFields?.filter((f) => f?.name)?.map((f) => f.name) ??
      []
    const inputFields = input.inputFields.filter((field) =>
      formFieldNames.includes(field.name),
    )

    if (emailSignupModel.signupType === SignupType.Mailchimp) {
      return this.mailchimpSignupService.subscribeToMailingList(
        emailSignupModel,
        inputFields,
      )
    }

    if (emailSignupModel.signupType === SignupType.Zenter) {
      return this.zenterSignupService.subscribeToMailingList(
        emailSignupModel,
        inputFields,
      )
    }

    if (emailSignupModel.signupType === SignupType.CampaignMonitor) {
      return this.campaignMonitorSignupService.subscribeToMailingList(
        emailSignupModel,
        inputFields,
      )
    }

    return { subscribed: false }
  }
}
