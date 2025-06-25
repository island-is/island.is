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
} from '@island.is/application/templates/signature-collection/presidential-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import { SignatureCollection } from './types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { getCollectionTypeFromApplicationType } from '../shared/utils'

@Injectable()
export class SignatureListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {
    super(ApplicationTypes.PRESIDENTIAL_LIST_CREATION)
  }

  private collectionType = getCollectionTypeFromApplicationType(
    ApplicationTypes.PRESIDENTIAL_LIST_CREATION,
  )

  async createLists({ auth, application }: TemplateApiModuleActionProps) {
    const answers = application.answers as CreateListSchema
    const collectionType = getCollectionTypeFromApplicationType(
      application.typeId,
    )
    const currentCollection: SignatureCollection = application.externalData
      .currentCollection?.data as SignatureCollection
    const collectionId = currentCollection.id

    const owner: OwnerInput = {
      ...answers.applicant,
      nationalId: answers.applicant.nationalId.replace('-', ''),
    }
    const slug = await this.signatureCollectionClientService.createLists(
      {
        collectionId,
        owner,
        collectionType,
      },
      auth,
    )

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

  async ownerRequirements({ auth, application }: TemplateApiModuleActionProps) {
    const collectionType = getCollectionTypeFromApplicationType(
      application.typeId,
    )
    const { canCreate, canCreateInfo } =
      await this.signatureCollectionClientService.getSignee(
        auth,
        collectionType,
      )

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

  async getLatestCollection() {
    return await this.signatureCollectionClientService.getLatestCollectionForType(
      this.collectionType,
    )
  }
}
