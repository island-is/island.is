/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import qs from 'qs'
import { logger } from '@island.is/logging'

export class DocumentOauthConnection {
  static async fetchToken(
    clientId: string,
    clientSecret: string,
    tokenUrl: string,
    basePath: string,
  ): Promise<string> {
    if (!clientId || !clientSecret || !tokenUrl) {
      logger.info(
        'No credentials provided to fetchToken for DocumentOauthConnection',
      )
      return ''
    }

    logger.debug('Fetching token for Document Service')

    try {
      const postData = {
        clientId,
        scope: `${basePath}/.default`,
        clientSecret,
        grant_type: 'client_credentials',
      }
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded'

      const result = await axios.post(tokenUrl, qs.stringify(postData))
      logger.debug(result.data)
      return result.data.access_token
    } catch (exception) {
      logger.error('Token fetch failed with , ', exception)
      return ''
    }
  }
}
