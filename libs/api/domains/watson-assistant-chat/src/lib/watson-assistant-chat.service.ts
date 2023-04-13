import jwt from 'jsonwebtoken'
import { ConfigType } from '@island.is/nest/config'
import { WatsonAssistantChatIdentityTokenInput } from './dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'
import RSA from 'node-rsa'

export class WatsonAssistantChatService {
  private rsaKey!: RSA

  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {
    this.rsaKey = new RSA(this.config.directorateOfImmigrationPublicIBMKey)
  }

  async createIdentityToken(input: WatsonAssistantChatIdentityTokenInput) {
    const encryptedUserPayload = this.rsaKey.encrypt(
      {
        name: input.name,
        email: input.email,
      },
      'base64',
    )

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
}
