import {
  AircraftDto,
  AircraftRegistryApi,
} from '@island.is/clients/aircraft-registry'
import { AllAircraftsResponse } from './dto/allAircraftsResponse'
import { Injectable } from '@nestjs/common'
import { AircraftsBySearchTermResponse } from './dto/aircraftsBySearchTermResponse'

@Injectable()
export class AircraftRegistryService {
  constructor(private readonly api: AircraftRegistryApi) {}

  async getAllAircrafts(
    pageNumber: number,
    pageSize: number,
  ): Promise<AllAircraftsResponse> {
    const response = await this.api.getAllAircraftsGet({
      pageNumber,
      pageSize,
    })
    return {
      aircrafts: response.data,
      pageNumber: response.pageNumber,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
    }
  }

  async getAircraftBySearchTerm(
    searchTerm: string,
  ): Promise<AircraftsBySearchTermResponse> {
    const response = await this.api.getAllAircraftsGet({ searchTerm })

    return {
      aircrafts: response.data,
    }
  }
}
