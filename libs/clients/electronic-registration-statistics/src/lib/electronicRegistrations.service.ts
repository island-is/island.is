import { Inject, Injectable } from '@nestjs/common'
import { Configuration, StatisticsApi } from '../../gen/fetch'
import { ElectronicRegistrationsClientConfig } from './electronicRegistrations.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Injectable()
export class ElectronicRegistrationsClientService {
  constructor(
    @Inject(ElectronicRegistrationsClientConfig.KEY)
    private clientConfig: ConfigType<
      typeof ElectronicRegistrationsClientConfig
    >,
  ) {}

  private async createApi() {
    return new StatisticsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-electronic-registration-statistics',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
  }

  async getBrokenDownElectronicRegistrationStatistics(filter: {
    year: number
  }) {
    const api = await this.createApi()

    const data = await api.faSundurlidadaThinglysingarTolfraediAsync({
      dateFrom: new Date(filter.year, 0, 1),
      dateTo: new Date(filter.year + 1, 0, 0),
    })

    return {
      electronicRegistrationStatisticBreakdown: data,
    }
  }
}
