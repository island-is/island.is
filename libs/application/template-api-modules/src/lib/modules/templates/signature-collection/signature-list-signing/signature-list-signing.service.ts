import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMessages } from '@island.is/application/templates/signature-collection/presidential-list-signing'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { getCollectionTypeFromApplicationType } from '../shared/utils'

@Injectable()
export class SignatureListSigningService extends BaseTemplateApiService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.PRESIDENTIAL_LIST_SIGNING)
  }
  private collectionType = getCollectionTypeFromApplicationType(
    ApplicationTypes.PRESIDENTIAL_LIST_SIGNING,
  )
  async signList({ auth, application }: TemplateApiModuleActionProps) {
    const listId = application.answers.listId
    if (!listId || typeof listId !== 'string' || listId.trim() === '') {
      throw new TemplateApiError(errorMessages.submitFailure, 400)
    }

    const signature = await this.signatureCollectionClientService.signList(
      listId,
      this.collectionType,
      auth,
    )
    if (signature) {
      return signature
    } else {
      throw new TemplateApiError(errorMessages.submitFailure, 405)
    }
  }

  async canSign({ auth }: TemplateApiModuleActionProps) {
    const signee = await this.signatureCollectionClientService.getSignee(
      auth,
      this.collectionType,
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
        case ReasonKey.noInvalidSignature:
          return errorMessages.invalidSignature
        default:
          return errorMessages.deniedByService
      }
    })
    throw new TemplateApiError(errors, 405)
  }

  async getList({ auth, application }: TemplateApiModuleActionProps) {
    const canSignStatus = application.externalData?.canSign?.status
    if (canSignStatus !== 'success') {
      // If canSign failed, the user will be stopped by the error there
      // We return an empty array to not add redundant errors to the response
      return []
    }
    // Returns the list user is trying to sign, in the appropriate area
    const areaId = (
      application.externalData.canSign.data as {
        area: { id: string }
      }
    ).area?.id

    if (!areaId) {
      // If no area user will be stopped by can sign above
      throw new TemplateApiError(errorMessages.areaId, 400)
    }
    const ownerId = application.answers.initialQuery as string
    // Check if user got correct ownerId
    const isCandidateId =
      await this.signatureCollectionClientService.isCandidateId(ownerId, auth)

    if (ownerId && !isCandidateId) {
      throw new TemplateApiError(errorMessages.candidateNotFound, 400)
    }

    // If initialQuery is not defined return all list for area
    const lists = await this.signatureCollectionClientService.getLists({
      nationalId: auth.nationalId,
      candidateId: isCandidateId ? ownerId : undefined,
      areaId,
      onlyActive: true,
      collectionType: this.collectionType,
    })

    if (isCandidateId && !lists.some((list) => list.candidate.id === ownerId)) {
      throw new TemplateApiError(errorMessages.candidateListActive, 400)
    }

    // If candidateId existed or if there is only one list, check if maxReached
    if (lists.length === 1) {
      const { maxReached } = lists[0]
      if (maxReached) {
        throw new TemplateApiError(errorMessages.maxReached, 405)
      }
    }
    if (lists.length === 0) {
      throw new TemplateApiError(errorMessages.active, 404)
    }

    return lists
  }
}
