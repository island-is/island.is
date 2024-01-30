import jwt from 'jsonwebtoken'
import { publicEncrypt, constants } from 'crypto'
import { ConfigType } from '@island.is/nest/config'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { WatsonAssistantChatIdentityTokenInput } from './dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'
import { WatsonAssistantChatSubmitFeedbackInput } from './dto/watsonAssistantChatSubmitFeedback.input'

export class WatsonAssistantChatService {
  private fetch: EnhancedFetchAPI

  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {
    this.fetch = createEnhancedFetch({ name: 'WatsonAssistantChatService' })
  }

  async createIdentityToken(input: WatsonAssistantChatIdentityTokenInput) {
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

  async submitFeedback(input: WatsonAssistantChatSubmitFeedbackInput) {
    const response = await this.fetch(this.config.chatFeedbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    return {
      success: response.ok,
    }
  }
}
