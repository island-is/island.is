import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
import { NationalRegistryUser } from './models/nationalRegistryUser'
import * as kennitala from 'kennitala'
@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {}

  async nationalRegistry({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryUser> {
    const user = await this.nationalRegistryApi.getUser(auth.nationalId)
    return {
      nationalId: user.Kennitala,
      fullName: user.Fulltnafn,
      age: kennitala.info(auth.nationalId).age,
      citizenship: {
        code: user.Rikisfang,
        name: user.RikisfangLand,
      },
      address: {
        code: user.LoghHusk,
        lastUpdated: user.LoghHuskBreytt,
        streetAddress: user.Logheimili,
        city: user.LogheimiliSveitarfelag,
        postalCode: user.Postnr,
      },
    }
  }
}
