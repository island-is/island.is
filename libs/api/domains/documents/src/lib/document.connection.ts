/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'
import qs from 'qs'
import { logger } from '@island.is/logging'

export class DocumentOauthConnection {
  static async fetchToken(): Promise<string> {
    const client_id = process.env.POSTHOLF_CLIENTID
    const client_secret = process.env.POSTHOLF_CLIENT_SECRET
    const token_url = process.env.POSTHOLF_TOKEN_URL
    logger.debug('Fetching token for Document Service')

    try {
      const postData = {
        client_id,
        scope:
          'https://test-skjalabirting-island-is.azurewebsites.net/.default',
        client_secret,
        grant_type: 'client_credentials',
      }
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded'

      const result = await axios.post(token_url, qs.stringify(postData))
      logger.debug(result.data)
      return result.data.access_token
    } catch (exception) {
      logger.error('Token fetch failed with , ', exception)
      return ''
    }
  }
}
