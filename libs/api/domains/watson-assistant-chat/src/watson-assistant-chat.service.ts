import jwt from 'jsonwebtoken'
import RSA from 'node-rsa'
import { ConfigType } from '@island.is/nest/config'
import { WatsonAssistantChatIdentityTokenInput } from './lib/dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'

export class WatsonAssistantChatService {
  private rsaKey!: RSA

  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {
    this.rsaKey = new RSA(config.directorateOfImmigrationPublicRSAKey)
  }

  async getIdentityToken(input: WatsonAssistantChatIdentityTokenInput) {
    const userPayload = this.rsaKey.encrypt(
      {
        name: input.name,
        email: input.email,
      },
      'base64',
    )

    const payload = {
      user_payload: userPayload,
      iss: 'www.ibm.com',
      acr: 'loa1',
    }

    return {
      token: jwt.sign(
        payload,
        this.config.directorateOfImmigrationPrivateRSAKey,
        { algorithm: 'RS256', expiresIn: '1h' },
      ),
    }
  }
}
