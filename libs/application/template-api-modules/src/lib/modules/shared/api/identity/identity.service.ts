import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { Identity, IdentityClientService } from '@island.is/clients/identity'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class IdentityService extends BaseTemplateApiService {
  constructor(private readonly identityService: IdentityClientService) {
    super('Identity')
  }

  async identity({
    auth,
  }: TemplateApiModuleActionProps): Promise<Identity | null> {
    const identity = await this.identityService.getIdentity(auth.nationalId)

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

  async identity2({
    auth,
  }: TemplateApiModuleActionProps): Promise<Identity | null> {
    const identity = await this.identityService.getIdentity2(auth.nationalId)

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
