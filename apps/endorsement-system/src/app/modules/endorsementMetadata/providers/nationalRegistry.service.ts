import { NationalRegistryApi } from '@island.is/clients/national-registry'
import { Injectable } from '@nestjs/common'
import { MetadataProvider } from '../endorsementMetadata.service'

export interface NationalRegistryInput {
  nationalId: string
}
export interface NationalRegistryResponse {
  fullName: string
  address: {
    streetAddress: string
    city: string
    postalCode: string
  }
}

@Injectable()
export class NationalRegistryService implements MetadataProvider {
  constructor(private readonly nationalRegistryApi: NationalRegistryApi) {}
  metadataKey = 'nationalRegistry'

  async getData(input: NationalRegistryInput) {
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
