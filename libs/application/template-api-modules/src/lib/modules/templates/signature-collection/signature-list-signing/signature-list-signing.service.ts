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

  async signList({ auth, application }: TemplateApiModuleActionProps) {
    const listId = application.answers.listId
      ? (application.answers.listId as string)
      : (application.externalData.getList.data as any)[0].id

    const signature = await this.signatureCollectionClientService.signList(
      listId,
      auth.nationalId,
    )
    if (signature) {
      return signature
    } else {
      throw new TemplateApiError(errorMessages.submitFailure, 405)
    }
  }

  async canSign({ auth }: TemplateApiModuleActionProps) {
    const signee = await this.signatureCollectionClientService.getSignee(
      auth.nationalId,
    )
    const { canSign, canSignInfo } = signee

    if (canSign) {
      return signee
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
        case ReasonKey.AlreadySigned:
          return errorMessages.signer
        case ReasonKey.AlreadyOwner:
          return errorMessages.owner
        default:
          return errorMessages.deniedByService
      }
    })
    throw new TemplateApiError(errors, 405)
  }

  async getList({ auth, application }: TemplateApiModuleActionProps) {
    // Returns the list user is trying to sign, in the apporiate area
    const ownerId = application.answers.initialQuery as string
    // If initialQuery is not defined return all list for area
    const lists = await this.signatureCollectionClientService.getLists({
      nationalId: auth.nationalId,
      candidateId: ownerId,
    })
    if (lists.length === 1) {
      const { maxReached } = lists[0]
      if (maxReached) {
        throw new TemplateApiError(errorMessages.maxReached, 405)
      }
    }
    return lists
  }
}
