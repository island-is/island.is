import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  SignatureCollectionClientService,
  ReasonKey,
  OwnerInput,
} from '@island.is/clients/signature-collection'
import { generateApplicationSubmittedEmail } from './emailGenerators'
import { ProviderErrorReason } from '@island.is/shared/problem'
import {
  CreateListSchema,
  errorMessages,
} from '@island.is/application/templates/signature-collection/signature-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import { SignatureCollection } from './types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SignatureListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.SIGNATURE_LIST_CREATION)
  }

  async createLists({ application }: TemplateApiModuleActionProps) {
    const answers = application.answers as CreateListSchema
    const currentCollection: SignatureCollection = application.externalData
      .currentCollection?.data as SignatureCollection
    const collectionId = currentCollection.id

    const owner: OwnerInput = {
      ...answers.applicant,
      nationalId: answers.applicant.nationalId.replace('-', ''),
    }
    // Pretend to be doing stuff for a short while
    const slug = await this.signatureCollectionClientService.createLists({
      collectionId,
      owner,
    })

    try {
    // Use the shared service to send an email using a custom email generator
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationSubmittedEmail,
      application,
    )

    } catch (e) {
      this.logger.warn(
        'Could not send submit email to admins for application: ',
        application.id,
      )
    }

    return slug
  }

  async ownerRequirements({ auth }: TemplateApiModuleActionProps) {
    const { canCreate, canCreateInfo } =
      await this.signatureCollectionClientService.getSignee(auth.nationalId)
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

  async currentCollection() {
    return await this.signatureCollectionClientService.getCurrentCollection()
  }
}
