import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import md5 from 'crypto-js/md5'

import { logger } from '@island.is/logging'

import { environment } from '../environments'

const { yay } = environment

interface GiftCard {
  giftCardId: number
  amount: number
  indentifier: string
}

interface GiftCardCode {
  code: string
  expiryDate: string
  pollingUrl: string
}

class RskAPI extends RESTDataSource {
  baseURL = `${yay.url}/api/v1/`

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    const timestamp = new Date().toISOString()
    request.headers.set('ApiKey', yay.apiKey)
    request.headers.set('X-Timestamp', timestamp)
    request.headers.set(
      'X-Signature',
      md5(`${yay.apiKey}-${yay.secretKey}-${timestamp}`),
    )
  }

  async getGiftCards(
    mobileNumber: string,
    countryCode: string,
  ): Promise<GiftCard[]> {
    try {
      return this.get(`GiftCard/${countryCode}-${mobileNumber}`)
    } catch (err) {
      logger.error(err)
      return []
    }
  }

  async getGiftCardCode(
    giftCardId: string,
    mobileNumber: string,
    countryCode: string,
  ): Promise<GiftCardCode> {
    try {
      return this.get(
        `GiftCardCode/${giftCardId}/${countryCode}-${mobileNumber}`,
      )
    } catch (err) {
      logger.error(err)
      throw new Error('Error occurred while requesting giftcardcode')
    }
  }
}

export default RskAPI
