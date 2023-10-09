import { AircraftRegistryApi } from '@island.is/clients/aircraft-registry'
import { AllAircraftsResponse } from './dto/allAircraftsResponse'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AircraftRegistryService {
  constructor(private readonly api: AircraftRegistryApi) {}

  async getAllAircrafts(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<AllAircraftsResponse> {
    const response = await this.api.getAllAircraftsGet({
      pageNumber,
      pageSize,
      searchTerm,
    })
    return {
      aircrafts: response.data,
      pageNumber: response.pageNumber,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
    }
  }
}
