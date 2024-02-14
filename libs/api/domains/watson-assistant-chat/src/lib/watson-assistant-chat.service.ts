import jwt from 'jsonwebtoken'
import { publicEncrypt, constants } from 'crypto'
import { ConfigType } from '@island.is/nest/config'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { IdentityTokenInput } from './dto/identityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'
import { ThumbStatus, SubmitFeedbackInput } from './dto/submitFeedback.input'

const thumbStatusToNumberMap: Record<ThumbStatus, number> = {
  [ThumbStatus.Down]: -1,
  [ThumbStatus.NoChoice]: 0,
  [ThumbStatus.Up]: 1,
}

export class WatsonAssistantChatService {
  private fetch: EnhancedFetchAPI

  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {
    this.fetch = createEnhancedFetch({ name: 'WatsonAssistantChatService' })
  }

  async createIdentityToken(input: IdentityTokenInput) {
    const encryptedUserPayload = publicEncrypt(
      {
        key: this.config.directorateOfImmigrationPublicIBMKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha1',
      },
      Buffer.from(
        JSON.stringify({
          name: input.name,
          email: input.email,
        }),
      ),
    ).toString('base64')

    const payload = {
      user_payload: encryptedUserPayload,
      iss: 'www.ibm.com',
      acr: 'loa1',
      sub: input.userID,
    }

    return {
      token: jwt.sign(
        payload,
        this.config.directorateOfImmigrationPrivateRSAKey,
        { algorithm: 'RS256', expiresIn: '1h' },
      ),
    }
  }

  private async fetchAccessToken() {
    const body = new URLSearchParams()
    body.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey')
    body.append('apikey', this.config.chatFeedbackApiKey)

    const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      redirect: 'follow',
    })

    const result = await response.json()
    return result.access_token
  }

  async submitFeedback(input: SubmitFeedbackInput) {
    const accessToken = await this.fetchAccessToken()
    const requestParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...input,
        thumbStatus: thumbStatusToNumberMap[input.thumbStatus],
        timestamp: new Date().toISOString(),
      }),
    }

    const response = await this.fetch(
      this.config.chatFeedbackUrl,
      requestParameters,
    )

    return {
      success: response.ok,
    }
  }
}
