import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CmsContentfulService } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupResponse } from './models/emailSignupResponse.model'

@Resolver()
@Injectable()
export class EmailSignupResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

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
      const url = (emailSignupModel.configuration?.signupUrl as string) ?? ''
      const populatedUrl = url.replace(
        '{{INPUT_FIELDS}}',
        inputFields
          .map((field) => {
            // The checkboxes type can have many selected options
            if (field.type === 'checkboxes') {
              const fieldValues = JSON.parse(field.value)
              const checkboxOptions = Object.entries(fieldValues)
                .filter(([_, value]) => value === 'true')
                .map(([name, _]) => `${name}=1`)
                .join('&')

              // Make sure we don't add an extra &
              if (checkboxOptions[checkboxOptions.length - 1] === '&')
                return checkboxOptions.slice(0, checkboxOptions.length - 1)
              return checkboxOptions
            }

            return `${field.name}=${field.value}`
          })
          .join('&'),
      )
      return axios
        .get(populatedUrl)
        .then((response) => {
          console.log(response.data)
          return {
            subscribed: true,
          }
        })
        .catch(() => ({
          subscribed: false,
        }))
    }

    return { subscribed: false }
  }
}
