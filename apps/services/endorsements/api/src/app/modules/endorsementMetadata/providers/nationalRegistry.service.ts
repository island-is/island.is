import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { Injectable } from '@nestjs/common'
import { MetadataProvider } from '../endorsementMetadata.service'

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
  constructor(private readonly nationalRegistryApi: NationalRegistryApi) {}
  metadataKey = 'nationalRegistryUser'

  async getData(input: NationalRegistryUserInput) {
    const user = await this.nationalRegistryApi.getUser(input.nationalId)
    return {
      fullName: user.Fulltnafn,
      address: {
        streetAddress: user.Logheimili,
        city: user.LogheimiliSveitarfelag,
        postalCode: user.Postnr,
      },
    }
  }
}
