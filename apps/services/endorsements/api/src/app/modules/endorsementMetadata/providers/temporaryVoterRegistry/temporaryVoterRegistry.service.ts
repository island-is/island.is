import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { MetadataProvider } from '../../types'
import { TemporaryVoterRegistryApi } from './gen/fetch'
import type { Auth } from '@island.is/auth-nest-tools'

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

  private temporaryVoterRegistryApiWithAuth(auth: Auth) {
    return this.temporaryVoterRegistryApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async getData({ nationalId }: TemporaryVoterRegistryInput, auth: Auth) {
    const results = await this.temporaryVoterRegistryApiWithAuth(
      auth,
    ).voterRegistryControllerFindByNationalId({
      nationalId,
    })
    return {
      voterRegionNumber: results.regionNumber,
      voterRegionName: results.regionName,
    }
  }
}
