import { CurrentUser, User } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Inject, Injectable } from '@nestjs/common'
import { Configuration, EhicApi } from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CardType } from './types'

@Injectable()
export class EuropeanHealthInsuranceCardClientService {
  constructor(
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getApi(): EhicApi {
    const configuration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'ehic-api-v1',
        treat400ResponsesAsErrors: true,
        logErrorResponseBody: true,
        timeout: 20000, // needed because the external service is taking a while to respond to submitting the document
      }),
      basePath: 'https://midgardur-test.sjukra.is/ehic'.replace(/\/+$/, ''), //`${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
      headers: {
        'X-Road-Client': this.xroadConfig.xRoadClient,
        // userName: `${username}`,
        // password: `${password}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const api = new EhicApi(configuration)
    // TODO: add token
    return api
  }

  private toCommaDelimitedList(arr: string[]) {
    let listString = ''
    for (let i = 0; i < arr.length; i++) {
      listString += arr[i]
      if (i !== arr.length - 1) {
        listString += ','
      }
    }
    return listString
  }

  async getCardResponse(@CurrentUser() user: User, nationalIds: string[]) {
    try {
      const resp = await this.getApi().cardStatus({
        usernationalid: user.nationalId,
        applicantnationalids: this.toCommaDelimitedList(nationalIds),
      })

      if (!resp) {
        this.logger.error(`Ehic.API getCardResponse no data found`)
      }
      return resp
    } catch (error) {
      this.logger.error(`Ehic.API getCardResponse error`, error)
    }
    return null
  }

  private async requestCard(
    @CurrentUser() user: User,
    nationalIds: string[],
    cardType: CardType,
  ) {
    for (let i = 0; i < nationalIds.length; i++) {
      try {
        await this.getApi().requestCard({
          applicantnationalid: nationalIds[i],
          cardtype: cardType,
          usernationalid: user.nationalId,
        })
      } catch (error) {
        this.logger.error(`Ehic.API requestCard error for ${cardType}`, error)
      }
    }
  }

  async applyForPhysicalCard(@CurrentUser() user: User, nationalIds: string[]) {
    return this.requestCard(user, nationalIds, CardType.PLASTIC)
  }

  async applyForTemporaryCard(
    @CurrentUser() user: User,
    nationalIds: string[],
  ) {
    return this.requestCard(user, nationalIds, CardType.PDF)
  }

  async getTemporaryCard(
    @CurrentUser() user: User,
    nationalId: string,
    cardNumber: string,
  ) {
    try {
      const resp = await this.getApi().fetchTempPDFCard({
        applicantnationalid: nationalId,
        cardnumber: cardNumber,
        usernationalid: user.nationalId,
      })

      if (!resp) {
        this.logger.error(`Ehic.API fetchTempPDFCard no data found`)
      }
      return resp
    } catch (error) {
      this.logger.error(`Ehic.API getTemporaryCard error`, error)
    }
  }
}
