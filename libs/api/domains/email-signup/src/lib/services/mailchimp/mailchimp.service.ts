import axios from 'axios'
import { Injectable } from '@nestjs/common'

import { EmailSignup } from '@island.is/cms'

import { FormFieldType } from '../../constants'
import { EmailSignupInput } from '../../dto/emailSignup.input'

@Injectable()
export class MailchimpSignupService {
  async subscribeToMailingList(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const url = (emailSignupModel.configuration?.signupUrl as string) ?? ''
    const populatedUrl = url.replace(
      '{{INPUT_FIELDS}}',
      inputFields
        .map((field) => {
          // The checkboxes type can have many selected options
          if (field.type === FormFieldType.CHECKBOXES) {
            const fieldValues = JSON.parse(field.value)

            // The field from the email signup model in the CMS (that's where we can access specific config)
            const emailSignupModelField = emailSignupModel.formFields?.find(
              (f) => f.id === field.id,
            )
            const checkboxOptions = Object.entries(fieldValues)
              .filter(([_, value]) => value === 'true')
              .map(
                ([name, _]) =>
                  // The field name maps to a specific mailchimp related value in the email config
                  `${emailSignupModelField?.emailConfig?.[name] ?? name}=1`,
              )
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
      .get(encodeURI(populatedUrl))
      .then((response) => {
        return {
          subscribed: response?.data?.result === 'error' ? false : true,
        }
      })
      .catch(() => ({
        subscribed: false,
      }))
  }
}
