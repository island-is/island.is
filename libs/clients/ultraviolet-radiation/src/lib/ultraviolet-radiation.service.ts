import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class UltravioletRadiationClientService {
  constructor(private readonly api: DefaultApi) {}

  async getLatestMeasurement() {
    return this.api.returnDailyUV()
  }

  async getMeasurementSeries() {
    return this.api.returnHourlyUV()
  }
}
