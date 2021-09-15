import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { Inject, Injectable } from '@nestjs/common'
import { environment } from '../../../../../environments'
import { MetadataProvider } from '../../types'

export interface NationalRegistryUserInput {
  nationalId: string
}
export interface NationalRegistryUserResponse {
  fullName: string
  address: {
    streetAddress: string
    city: string
    postalCode: string
  }
}

@Injectable()
export class NationalRegistryUserService implements MetadataProvider {
  constructor(
    @Inject(EinstaklingarApi)
    private individualApi: EinstaklingarApi,
  ) {}
  metadataKey = 'nationalRegistryUser'

  individualApiWithAuth(auth: Auth) {
    return this.individualApi.withMiddleware(
      new AuthMiddleware(
        auth,
        environment.metadataProvider.authMiddlewareOptions,
      ),
    )
  }

  async getData(input: NationalRegistryUserInput, auth: Auth) {
    const user = await this.individualApiWithAuth(
      auth,
    ).einstaklingarGetEinstaklingur({
      id: input.nationalId,
      xRoadClient: environment.metadataProvider.nationalRegistry.xRoadClient,
    })

    return {
      fullName: user.fulltNafn ?? user.nafn,
      address: {
        // we provide empty strings for values we can't know
        streetAddress: user.logheimili?.heiti ?? '',
        city: user.logheimili?.stadur ?? '',
        postalCode: user.logheimili?.postnumer ?? '',
      },
    }
  }
}
