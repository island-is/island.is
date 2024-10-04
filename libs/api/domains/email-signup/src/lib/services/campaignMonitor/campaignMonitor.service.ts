import { EmailSignup } from '@island.is/cms'
import { EmailSignupInput } from '../../dto/emailSignup.input'
import axios from 'axios'
import { ConfigType } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { CampaignMonitorSignupConfig } from './campaignMonitor.config'
import { LazyDuringDevScope } from '@island.is/nest/config'

@Injectable({ scope: LazyDuringDevScope })
export class CampaignMonitorSignupService {
  constructor(
    @Inject(CampaignMonitorSignupConfig.KEY)
    private readonly config: ConfigType<typeof CampaignMonitorSignupConfig>,
  ) {}

  async subscribeToMailingList(
    emailSignupModel: EmailSignup,
    inputFields: EmailSignupInput['inputFields'],
  ) {
    const url = (emailSignupModel.configuration?.signupUrl as string) ?? ''

    const API_KEY = this.config.vinnueftirlitidCampaignMonitorApiKey

    const authHeader = `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`

    const map = new Map()

    map.set('ConsentToTrack', 'Yes')
    map.set('Resubscribe', true)

    for (const field of inputFields) {
      map.set(field.name, field.value)
    }

    const obj = Object.fromEntries(map)

    return axios
      .post(url, obj, { headers: { Authorization: authHeader } })
      .then((response) => {
        return {
          subscribed: response?.data?.result === 'error' ? false : true,
        }
      })
      .catch(() => {
        return { subscribed: false }
      })
  }
}
