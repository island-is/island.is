import jwt from 'jsonwebtoken'
import { ConfigType } from '@island.is/nest/config'
import { WatsonAssistantChatIdentityTokenInput } from './dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'
import { publicEncrypt } from 'crypto'

export class WatsonAssistantChatService {
  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {}

  async createIdentityToken(input: WatsonAssistantChatIdentityTokenInput) {
    const encryptedUserPayload = publicEncrypt(
      this.config.directorateOfImmigrationPublicIBMKey,
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
}
