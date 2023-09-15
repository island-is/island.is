import { Injectable } from '@nestjs/common'
import { StatisticsApi } from '../../gen/fetch'

@Injectable()
export class ElectronicRegistrationsClientService {
  constructor(private readonly api: StatisticsApi) {}

  async getBrokenDownElectronicRegistrationStatistics(filter: {
    year: number
  }) {
    const data = await this.api.faSundurlidadaThinglysingarTolfraediAsync({
      dateFrom: new Date(filter.year, 0, 1),
      dateTo: new Date(filter.year + 1, 0, 0),
    })

    return {
      electronicRegistrationStatisticBreakdown: data,
    }
  }
}
