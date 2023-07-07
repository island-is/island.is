import {
  AircraftDto,
  AircraftRegistryApi,
} from '@island.is/clients/aircraft-registry'
import { AllAircraftsResponse } from './dto/allAircraftsResponse'
import { Injectable } from '@nestjs/common'
import { AircraftsBySearchTermResponse } from './dto/AircraftsBySearchTermResponse'

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
    const numericSearchTerm = Number(searchTerm)
    const isSearchTermNumeric = !isNaN(numericSearchTerm)

    const [
      lettersResponse,
      serialNumberResponse,
      registrationNumberResponse,
      typeResponse,
    ] = await Promise.all([
      this.api.getAircraftByLettersLettersGet({ letters: searchTerm }),
      this.api.getAircraftBySerialNumberSerialNumberGet({
        serialNumber: searchTerm,
      }),
      isSearchTermNumeric
        ? this.api.getAircraftRegistrationNumberGet({
            registrationNumber: numericSearchTerm,
          })
        : null,
      this.api.getAircraftsByTypeTypeGet({ type: searchTerm }),
    ])

    const data = new Map<string, AircraftDto>()

    if (lettersResponse?.data?.identifiers) {
      data.set(lettersResponse.data.identifiers as string, lettersResponse.data)
    }

    if (serialNumberResponse?.data?.identifiers) {
      data.set(
        serialNumberResponse.data.identifiers as string,
        serialNumberResponse.data,
      )
    }

    if (registrationNumberResponse?.data?.identifiers) {
      data.set(
        registrationNumberResponse.data.identifiers as string,
        registrationNumberResponse.data,
      )
    }

    if (typeResponse?.data?.length) {
      for (const aircraft of typeResponse.data) {
        if (aircraft?.identifiers) {
          data.set(aircraft.identifiers, aircraft)
        }
      }
    }

    const aircrafts = Array.from(data, ([_, value]) => value)

    return {
      aircrafts,
    }
  }
}
