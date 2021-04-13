import { NationalRegistryApi } from '@island.is/clients/national-registry'
import { Injectable } from '@nestjs/common'

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
export class NationalRegistryService {
  constructor (private readonly nationalRegistryApi: NationalRegistryApi) {}

  async getData (input: NationalRegistryInput) {
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
