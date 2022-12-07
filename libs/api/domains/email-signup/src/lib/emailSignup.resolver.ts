import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CmsContentfulService } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupResponse } from './models/emailSignupResponse.model'
import { EmailSignupService } from './emailSignup.service'

@Resolver()
@Injectable()
export class EmailSignupResolver {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly emailSignupService: EmailSignupService,
  ) {}

  @Mutation(() => EmailSignupResponse)
  async emailSignupSubscription(
    @Args('input') input: EmailSignupInput,
  ): Promise<EmailSignupResponse> {
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
      return this.emailSignupService.subscribeToMailchimp(
        emailSignupModel,
        inputFields,
      )
    }

    if (emailSignupModel.signupType === 'zenter') {
      return this.emailSignupService.subscribeToZenter(
        emailSignupModel,
        inputFields,
      )
    }

    return { subscribed: false }
  }
}
