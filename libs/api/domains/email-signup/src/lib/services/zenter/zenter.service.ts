import axios from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { EmailSignup } from '@island.is/cms'

import { EmailSignupInput } from '../../dto/emailSignup.input'
import { FormFieldType, ZENTER_IMPORT_ENDPOINT_URL } from '../../constants'
import { ZenterSignupConfig } from './zenter.config'
import { LazyDuringDevScope } from '@island.is/nest/config'

export const ZENTER_AUDIENCE_ID_SELECTOR_FIELD_NAME = 'zenterAudienceIdSelector'

@Injectable({ scope: LazyDuringDevScope })
export class ZenterSignupService {
  constructor(
    @Inject(ZenterSignupConfig.KEY)
    private readonly config: ConfigType<typeof ZenterSignupConfig>,
  ) {}

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

  async subscribeToMailingList(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const owner = emailSignupModel.configuration?.owner as string

    if (owner !== 'fiskistofa') {
      throw new Error('Email signup configuration does not provide an owner')
    }

    const url =
      (emailSignupModel.configuration?.signupUrl as string) ??
      ZENTER_IMPORT_ENDPOINT_URL

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
      this.getZenterAudienceIdsFromSignupForm(
        emailSignupModel,
        inputFields,
      ) as unknown as string,
    )
    const response = await axios.post(url, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/plain',
      },
    })
    console.log('response', response.data)
    return { subscribed: response.data === 1 }
  }
}
