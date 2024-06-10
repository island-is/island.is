import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { Identity, IdentityClientService } from '@island.is/clients/identity'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

@Injectable()
export class IdentityService extends BaseTemplateApiService {
  constructor(
    private readonly identityService: IdentityClientService,
  ) //private readonly nationalRegistryV3ClientService: NationalRegistryV3ClientService,
  {
    super('Identity')
  }

  async identity({
    auth,
  }: TemplateApiModuleActionProps): Promise<Identity | null> {
    const identity = await this.identityService.getIdentity(auth.nationalId)
    // const otherIdentity =
    //   await this.nationalRegistryV3ClientService.getAllDataIndividual(
    //     auth.nationalId,
    //   )
    // console.log('otherIdentity', otherIdentity)
    if (!identity) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalIdNotFoundInNationalRegistryTitle,
          summary:
            coreErrorMessages.nationalIdNotFoundInNationalRegistrySummary,
        },
        400,
      )
    }

    return identity
  }
}
