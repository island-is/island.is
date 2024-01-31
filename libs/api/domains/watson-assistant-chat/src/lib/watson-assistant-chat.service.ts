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

  async submitFeedback(input: SubmitFeedbackInput) {
    const response = await this.fetch(this.config.chatFeedbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        thumbStatus: thumbStatusToNumberMap[input.thumbStatus],
        timestamp: Date.now(),
      }),
    })
    return {
      success: response.ok,
    }
  }
}
