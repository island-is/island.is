import { Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../../types'

import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMessages } from '@island.is/application/templates/signature-collection/signature-list-signing'
import { ProviderErrorReason } from '@island.is/shared/problem'

@Injectable()
export class SignatureListSigningService extends BaseTemplateApiService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.SIGNATURE_LIST_SIGNING)
  }

  async signList({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  async canSign({ auth, application }: TemplateApiModuleActionProps) {
    const { canSign, canSignInfo } =
      await this.signatureCollectionClientService.getSignee(auth.nationalId)
    if (canSign) {
      return true
    }
    if (!canSignInfo) {
      // canCreateInfo will always be defined if canCreate is false but we need to check for typescript
      throw new TemplateApiError(errorMessages.deniedByService, 400)
    }
    const errors: ProviderErrorReason[] = canSignInfo?.map((key) => {
      switch (key) {
        case ReasonKey.UnderAge:
          return errorMessages.age
        case ReasonKey.NoCitizenship:
          return errorMessages.citizenship
        case ReasonKey.NotISResidency:
          return errorMessages.residency
        case ReasonKey.CollectionNotOpen:
          return errorMessages.active
        case ReasonKey.AlreadyOwner:
          return errorMessages.signer
        default:
          return errorMessages.deniedByService
      }
    })
    throw new TemplateApiError(errors, 400)
  }
}
