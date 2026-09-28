import { Injectable } from '@nestjs/common'
import { IslandIsEndpointsApi } from '../../gen/fetch'

@Injectable()
export class TaxiClient {
  constructor(private readonly api: IslandIsEndpointsApi) {}

  getValidStations() {
    return this.api.getValidStations()
  }

  getDriversWithWorkPermit() {
    return this.api.getDriversWithWorkPermit()
  }

  getDriversWithOperatingLicence() {
    return this.api.getDriversWithOperatingLicence()
  }
}
