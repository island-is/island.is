import { Injectable } from '@nestjs/common'
import { MetadataProvider } from '../../types'
import { TemporaryVoterRegistryApi } from './gen/fetch'

export interface TemporaryVoterRegistryInput {
  nationalId: string
}
export interface TemporaryVoterRegistryResponse {
  voterRegionNumber: number
  voterRegionName: string
}

@Injectable()
export class TemporaryVoterRegistryService implements MetadataProvider {
  constructor(
    private readonly temporaryVoterRegistryApi: TemporaryVoterRegistryApi,
  ) {}
  metadataKey = 'temporaryVoterRegistry'

  async getData({ nationalId }: TemporaryVoterRegistryInput) {
    const results =
      await this.temporaryVoterRegistryApi.voterRegistryControllerFindByNationalId(
        {
          nationalId,
        },
      )
    return {
      voterRegionNumber: results.regionNumber,
      voterRegionName: results.regionName,
    }
  }
}
