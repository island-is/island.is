import { Injectable } from '@nestjs/common'

import { FetchError } from '@island.is/clients/middlewares'

import { EinstaklingarApi } from '../../gen/fetch'
import { formatIndividualDto, IndividualDto } from './types/individual.dto'

@Injectable()
export class NationalRegistryClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async getIndividual(nationalId: string): Promise<IndividualDto | null> {
    const response = await this.individualApi
      .einstaklingarGetEinstaklingurRaw({
        id: nationalId,
      })
      .catch(this.handleError)

    const individual =
      response === null || response.raw.status === 204
        ? null
        : await response.value()

    return formatIndividualDto(individual)
  }

  private handleError(error: FetchError): null {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}
