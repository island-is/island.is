import axios from 'axios'

import { ConfigType } from '@island.is/nest/config'
import { EmailSignup } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupConfig } from './emailSignup.config'

enum FormFieldType {
  CHECKBOXES = 'checkboxes',
}

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

  async subscribeToZenter(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const url = emailSignupModel.configuration?.signupUrl as string

    if (!url) {
      throw new Error('Email signup configuration does not provide a signupUrl')
    }

    const organization = emailSignupModel.configuration?.organization as string

    if (organization !== 'fiskistofa') {
      throw new Error(
        'Email signup configuration does not provide an organizaion',
      )
    }

    const tokenResponse = await axios.post(url, {
      query:
        'mutation($email:String!,$password:String!){ loginApiUser(email:$email, password:$password)}',
      variables: {
        email: this.config.fiskistofaZenterEmail,
        password: this.config.fiskistofaZenterPassword,
      },
    })

    // TODO: store token in memory and only get a new one if the old one got expired
    const token = tokenResponse?.data?.data?.loginApiUser
    if (!token) {
      throw new Error('Could not get access token from zenter GraphQL API')
    }

    const params = inputFields
      .map((field) => `$${field.name}:String!`)
      .join(',')

    const values = inputFields
      .map((field) => `${field.name}:$${field.name}`)
      .join(',')

    const variables = inputFields.reduce((acc, curr) => {
      acc[curr.name] = curr.value
      return acc
    }, {} as Record<string, string>)

    // Create a recipient
    await axios.post(`${url}?token=${token}`, {
      query: `mutation(${params}) { addRecipient(${values}) { id } }`,
      variables,
    })

    // Add that recipient to an audience list

    return { subscribed: true }
  }
}
