import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import md5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'

import { logger } from '@island.is/logging'

import { environment } from '../environments'

const { yay } = environment

interface GiftCard {
  giftCardId: number
  amount: number
  statusId: number
  indentifier: string
  giftDetail: {
    packageId: string | null
    from: string
    greeting: {
      greetingType: number
      text: string
      contentUrl: string
    }
    personalMessage: string
  }
}

interface GiftCardCode {
  code: string
  expiryDate: string
  pollingUrl: string
}

interface GiveGift {
  success: boolean
  message: string
}

class YayAPI extends RESTDataSource {
  baseURL = `${yay.url}/api/v1/`

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    const timestamp = new Date().toISOString()
    request.headers.set(
      'X-Signature',
      (md5(`${yay.apiKey}-${yay.secretKey}-${timestamp}`) as unknown) as string,
    )
    request.headers.set('ApiKey', yay.apiKey)
    request.headers.set('X-Timestamp', timestamp)
  }

  async getGiftCards(
    mobileNumber: string,
    countryCode: string,
  ): Promise<GiftCard[]> {
    try {
      const giftCards = await this.get(
        `GiftCard/${countryCode}-${mobileNumber}`,
      )
      return giftCards.filter((giftCard) => giftCard.statusId === 1)
    } catch (err) {
      logger.error(err)
      return []
    }
  }

  getGiftCardCode(
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

  giveGift(body: {
    mobileNumber: string
    countryCode: string
    giftCardId: number
    fromName: string
    giftToMobileNumber: string
    giftToCountryCode: string
    personalMessage: string
  }): Promise<GiveGift> {
    return this.post('ReGift', body)
  }
}

export default YayAPI
