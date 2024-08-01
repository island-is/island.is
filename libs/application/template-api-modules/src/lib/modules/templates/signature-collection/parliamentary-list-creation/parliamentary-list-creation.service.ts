import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  CreateParliamentaryCandidacyInput,
  MandateType,
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { errorMessages } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CollectionType } from 'libs/clients/signature-collection/src/lib/types/collection.dto'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class ParliamentaryListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.PARLIAMENTARY_LIST_CREATION)
  }

  async ownerRequirements({ auth }: TemplateApiModuleActionProps) {
    const { canCreate, canCreateInfo } =
      await this.signatureCollectionClientService.getSignee(auth)
    if (canCreate) {
      return true
    }
    if (!canCreateInfo) {
      // canCreateInfo will always be defined if canCreate is false but we need to check for typescript
      throw new TemplateApiError(errorMessages.deniedByService, 400)
    }
    const errors: ProviderErrorReason[] = canCreateInfo?.map((key) => {
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
          return errorMessages.owner
        default:
          return errorMessages.deniedByService
      }
    })
    throw new TemplateApiError(errors, 405)
  }

  async parliamentaryCollection({ auth }: TemplateApiModuleActionProps) {
    const currentCollection =
      await this.signatureCollectionClientService.currentCollection()
    if (currentCollection.collectionType !== CollectionType.Parliamentary) {
      throw new TemplateApiError(
        errorMessages.currentCollectionNotParliamentary,
        405,
      )
    }
  }

  async submit({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as CreateListSchema
    const input: CreateParliamentaryCandidacyInput = {
      owner: answers.applicant,
      agents: answers.managers
        .map((manager) => ({
          nationalId: manager.manager.nationalId,
          phoneNumber: '',
          mandateType: MandateType.Guarantor,
          email: '',
          areas: [],
        }))
        .concat(
          answers.supervisors.map((supervisor) => ({
            nationalId: supervisor.supervisor.nationalId,
            phoneNumber: '',
            mandateType: MandateType.Administrator,
            email: '',
            areas: [],
          })),
        ),
      collectionId: '',
      areas: [],
    }

    const result = await this.signatureCollectionClientService
      .createParliamentaryCandidacy(input, auth)
      .catch((e: FetchError) => {
        return {
          success: false,
          message: e.message,
        }
      })

    return {
      success: true,
    }
  }
}
