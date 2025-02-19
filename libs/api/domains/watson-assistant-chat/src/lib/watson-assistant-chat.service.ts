import jwt from 'jsonwebtoken'
import { publicEncrypt, constants } from 'crypto'
import { ConfigType } from '@island.is/nest/config'
import { IamAuthenticator, CloudantV1 } from '@ibm-cloud/cloudant'
import { IdentityTokenInput } from './dto/identityToken.input'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'
import { ThumbStatus, SubmitFeedbackInput } from './dto/submitFeedback.input'

const thumbStatusToNumberMap: Record<ThumbStatus, number> = {
  [ThumbStatus.Down]: -1,
  [ThumbStatus.NoChoice]: 0,
  [ThumbStatus.Up]: 1,
}

export class WatsonAssistantChatService {
  private cloudant: CloudantV1

  constructor(private config: ConfigType<typeof WatsonAssistantChatConfig>) {
    const authenticator = new IamAuthenticator({
      apikey: config.chatFeedbackApiKey,
    })
    this.cloudant = CloudantV1.newInstance({ authenticator })
    this.cloudant.setServiceUrl(this.config.chatFeedbackUrl)
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
    const response = await this.cloudant.postDocument({
      db: this.config.chatFeedbackDatabaseName,
      document: {
        ...input,
        thumbStatus: thumbStatusToNumberMap[input.thumbStatus],
        timestamp: new Date().toISOString(),
      },
    })

    return {
      success: response.result.ok,
    }
  }
}
