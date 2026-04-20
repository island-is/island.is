import axios from 'axios'
import qs from 'qs'
import { logger } from '@island.is/logging'
import { DocumentProviderClientConfig } from './documentProviderClientConfig'

export interface OauthConnectionResponse {
  token: string
  expiresIn: number
}

export class DocumentOauthConnection {
  static async fetchToken(
    config: DocumentProviderClientConfig,
  ): Promise<OauthConnectionResponse> {
    if (!config.clientId || !config.clientSecret || !config.tokenUrl) {
      logger.info(
        'No credentials provided to fetchToken for DocumentOauthConnection',
      )
      return {
        token: '',
        expiresIn: 0,
      }
    }

    try {
      const postData = {
        client_id: config.clientId,
        scope: `${config.basePath}/.default`,
        client_secret: config.clientSecret,
        grant_type: 'client_credentials',
      }
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded'

      const result = await axios.post(config.tokenUrl, qs.stringify(postData))
      return {
        token: result.data.access_token,
        expiresIn: result.data.expires_in,
      }
    } catch (exception) {
      logger.error('Token fetch failed with , ', exception)
      return {
        token: '',
        expiresIn: 0,
      }
    }
  }
}
