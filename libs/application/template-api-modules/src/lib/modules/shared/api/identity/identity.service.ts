import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { Identity, IdentityClientService } from '@island.is/clients/identity'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { IdentityParameters } from '@island.is/application/types'

@Injectable()
export class IdentityService extends BaseTemplateApiService {
  constructor(private readonly identityService: IdentityClientService) {
    super('Identity')
  }

  async identity({
    auth,
    params,
  }: TemplateApiModuleActionProps<IdentityParameters>): Promise<Identity | null> {
    const actorNationalId = params?.includeActorInfo
      ? auth.actor?.nationalId
      : undefined

    const identity = await this.identityService.getIdentity(
      auth.nationalId,
      actorNationalId,
    )

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
