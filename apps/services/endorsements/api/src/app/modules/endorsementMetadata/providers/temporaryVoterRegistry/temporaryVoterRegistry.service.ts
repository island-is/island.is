import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { environment } from '../../../../../environments'
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

  temporaryVoterRegistryApiWithAuth(auth: Auth) {
    return this.temporaryVoterRegistryApi.withMiddleware(
      new AuthMiddleware(auth, {
        forwardUserInfo: false,
        tokenExchangeOptions: {
          scope: '@island.is/system',
          requestActorToken: true,
          issuer: environment.auth.issuer,
          clientId: environment.endorsementClient.clientId,
          clientSecret: environment.endorsementClient.clientSecret,
        },
      }),
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
