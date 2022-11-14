import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CmsContentfulService, EmailSignup } from '@island.is/cms'

import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupResponse } from './models/emailSignupResponse.model'

enum FormFieldType {
  CHECKBOXES = 'checkboxes',
}

const FISKISTOFA_ZENTER_EMAIL = process.env.FISKISTOFA_ZENTER_EMAIL
const FISKISTOFA_ZENTER_PASSWORD = process.env.FISKISTOFA_ZENTER_PASSWORD

@Resolver()
@Injectable()
export class EmailSignupResolver {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  private async subscribeToMailchimp(
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
      .get(populatedUrl)
      .then((response) => {
        return {
          subscribed: response?.data?.result === 'error' ? false : true,
        }
      })
      .catch(() => ({
        subscribed: false,
      }))
  }

  private async subscribeToZenter(
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
        email: FISKISTOFA_ZENTER_EMAIL,
        password: FISKISTOFA_ZENTER_PASSWORD,
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

    await axios.post(`${url}?token=${token}`, {
      query: `mutation(${params}) { addRecipient(${values}) { id } }`,
      variables,
    })

    return { subscribed: true }
  }

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
      return this.subscribeToMailchimp(emailSignupModel, inputFields)
    }

    if (emailSignupModel.signupType === 'zenter') {
      return this.subscribeToZenter(emailSignupModel, inputFields)
    }

    return { subscribed: false }
  }
}
