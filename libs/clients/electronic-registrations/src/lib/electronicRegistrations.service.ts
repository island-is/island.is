import { Inject, Injectable } from '@nestjs/common'
import {
  Configuration,
  FaSundurlidadaThinglysingarTolfraediAsyncRequest,
  StatisticsApi,
} from '../../gen/fetch'
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
          name: 'clients-electronic-registrations',
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

  async getBrokenDownRegistrationStatistics(
    filter: FaSundurlidadaThinglysingarTolfraediAsyncRequest,
  ) {
    const api = await this.createApi()
    const data = await api.faSundurlidadaThinglysingarTolfraediAsync(filter)
    return data
  }

  async getTotalElectronicRegistrationActionRequests() {
    const api = await this.createApi()
    const data = await api.faFjoldaRafraennaThinglysingaBeidnaAsync()
    return data
  }
}
