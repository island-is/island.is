import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { GetCurrenciesApi } from '@island.is/clients/social-insurance-administration'

const isRunningInDevelopment = !(
  process.env.PROD_MODE === 'true' || process.env.NODE_ENV === 'production'
)

@Injectable()
export class SocialInsuranceAdministrationRepository {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private currenciesApi: GetCurrenciesApi,
  ) {
    this.logger.debug('Created Social insurance administration repository')
  }

  async getCurrencies(): Promise<Array<string>> {
    if (isRunningInDevelopment) {
      return [
        'ZAR',
        'AUD',
        'CAD',
        'CHF',
        'DKK',
        'EUR',
        'GBP',
        'NOK',
        'PLN',
        'SEK',
        'USD',
        'LVL',
        'CZK',
        'SKK',
        'IKR',
        'LTL',
        'VND',
        'BGN',
        'RUB',
        'CNY',
        'ALL',
        'LEI',
        'UAH',
        'HUF',
      ]
    }

    const currencies = await this.currenciesApi.applicationGetCurrencies()

    if (currencies) {
      return currencies
    }

    throw new Error('Could not fetch currencies')
  }
}
