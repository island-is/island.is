import { Injectable } from '@nestjs/common'

import { CmsContentfulService } from '@island.is/cms'

import { MailchimpSignupService } from './services/mailchimp/mailchimp.service'
import { ZenterSignupService } from './services/zenter/zenter.service'
import { EmailSignupInput } from './dto/emailSignup.input'

@Injectable()
export class EmailSignupService {
  constructor(
    private readonly zenterSignupService: ZenterSignupService,
    private readonly mailchimpSignupService: MailchimpSignupService,
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

    if (emailSignupModel.signupType === 'mailchimp') {
      return this.mailchimpSignupService.subscribeToMailingList(
        emailSignupModel,
        inputFields,
      )
    }

    if (emailSignupModel.signupType === 'zenter') {
      return this.zenterSignupService.subscribeToMailingList(
        emailSignupModel,
        inputFields,
      )
    }

    return { subscribed: false }
  }
}
