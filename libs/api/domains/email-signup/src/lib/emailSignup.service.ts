import axios from 'axios'

import { ConfigType } from '@island.is/nest/config'
import { EmailSignup } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupConfig } from './emailSignup.config'

enum FormFieldType {
  CHECKBOXES = 'checkboxes',
}

export const ZENTER_AUDIENCE_ID_SELECTOR_FIELD_NAME = 'zenterAudienceIdSelector'

export class EmailSignupService {
  constructor(private config: ConfigType<typeof EmailSignupConfig>) {}

  async subscribeToMailchimp(
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

  private getZenterAudienceIdsFromSignupForm(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const audienceIdSelectorFieldModel = emailSignupModel.formFields?.find(
      (field) => field.name === ZENTER_AUDIENCE_ID_SELECTOR_FIELD_NAME,
    )
    const audienceIdSelectorFieldDto = inputFields.find(
      (field) => field.name === ZENTER_AUDIENCE_ID_SELECTOR_FIELD_NAME,
    )

    const emailConfig = audienceIdSelectorFieldModel?.emailConfig
    const key = audienceIdSelectorFieldDto?.value

    let audiences =
      (emailSignupModel.configuration?.audiences as unknown[]) ?? []

    if (!!key && emailConfig) {
      if (audienceIdSelectorFieldModel.type === FormFieldType.CHECKBOXES) {
        audiences = Object.entries(JSON.parse(audienceIdSelectorFieldDto.value))
          .filter(([_, value]) => value === 'true')
          .map(([name]) => emailConfig[name])
      } else if (emailConfig[key]) audiences = [emailConfig[key]]
    }

    return audiences
  }

  async subscribeToZenterViaImport(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const url =
      (emailSignupModel.configuration?.signupUrl as string) ??
      'https://samskipti.zenter.is/import'

    const formData = new URLSearchParams()

    formData.append('client_id', this.config.fiskistofaZenterClientId)
    formData.append('password', this.config.fiskistofaZenterClientPassword)

    inputFields
      .filter((field) => field.name !== ZENTER_AUDIENCE_ID_SELECTOR_FIELD_NAME)
      .forEach((field) => {
        formData.append(field.name, field.value)
      })

    formData.append(
      'audiences',
      (this.getZenterAudienceIdsFromSignupForm(
        emailSignupModel,
        inputFields,
      ) as unknown) as string,
    )
    const response = await axios.post(url, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/plain',
      },
    })
    return { subscribed: response.data === 1 }
  }

  async subscribeToZenter(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const owner = emailSignupModel.configuration?.owner as string

    if (owner !== 'fiskistofa') {
      throw new Error('Email signup configuration does not provide an owner')
    }

    return this.subscribeToZenterViaImport(emailSignupModel, inputFields)
  }
}
