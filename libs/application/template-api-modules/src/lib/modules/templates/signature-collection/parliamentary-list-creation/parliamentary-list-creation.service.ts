import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  Collection,
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { errorMessages } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CollectionType } from '@island.is/clients/signature-collection'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { isCompany } from 'kennitala'
import { coreErrorMessages } from '@island.is/application/core'
import { generateApplicationSubmittedEmail } from './emailGenerators'
import { AuthDelegationType } from '@island.is/shared/types'
import { getCollectionTypeFromApplicationType } from '../shared/utils'
import { ProviderErrorReason } from '@island.is/shared/problem'
@Injectable()
export class ParliamentaryListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
    private nationalRegistryClientService: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.PARLIAMENTARY_LIST_CREATION)
  }
  private collectionType = getCollectionTypeFromApplicationType(
    ApplicationTypes.PARLIAMENTARY_LIST_CREATION,
  )
  async candidate({ auth }: TemplateApiModuleActionProps) {
    const candidate = await this.signatureCollectionClientService.getSignee(
      auth,
      this.collectionType,
    )

    if (!candidate.hasPartyBallotLetter) {
      throw new TemplateApiError(errorMessages.partyBallotLetter, 405)
    }
    if (!candidate.canCreate) {
      if (!candidate.canCreateInfo) {
        // canCreateInfo will always be defined if canCreate is false but we need to check for typescript
        throw new TemplateApiError(errorMessages.deniedByService, 400)
      }
      const errors: ProviderErrorReason[] = candidate.canCreateInfo?.map(
        (key) => {
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
        },
      )
      throw new TemplateApiError(errors, 405)
    }

    return candidate
  }

  async parliamentaryCollection({ auth }: TemplateApiModuleActionProps) {
    const latestCollection =
      await this.signatureCollectionClientService.getLatestCollectionForType(
        this.collectionType,
      )
    if (latestCollection.collectionType !== CollectionType.Parliamentary) {
      throw new TemplateApiError(
        errorMessages.currentCollectionNotParliamentary,
        405,
      )
    }
    // Candidates are stored on user national id never the actors so should be able to check just the auth national id

    if (
      latestCollection.candidates.some(
        (c) => c.nationalId.replace('-', '') === auth.nationalId,
      )
    ) {
      throw new TemplateApiError(errorMessages.alreadyCandidate, 412)
    }

    return latestCollection
  }

  async parliamentaryIdentity({ auth }: TemplateApiModuleActionProps) {
    const contactNationalId = isCompany(auth.nationalId)
      ? auth.actor?.nationalId ?? auth.nationalId
      : auth.nationalId

    const identity = await this.nationalRegistryClientService.getIndividual(
      contactNationalId,
    )

    if (!identity) {
      throw new TemplateApiError(
        coreErrorMessages.nationalIdNotFoundInNationalRegistrySummary,
        500,
      )
    }

    return identity
  }

  async delegatedToCompany({ auth }: TemplateApiModuleActionProps) {
    const data = {
      delegatedToCompany:
        auth.delegationType?.includes(AuthDelegationType.ProcurationHolder) ??
        false,
    }
    return data
  }

  async submit({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as CreateListSchema
    const parliamentaryCollection = application.externalData
      .parliamentaryCollection.data as Collection

    const input = {
      collectionType: this.collectionType,
      owner: {
        ...answers.applicant,
        nationalId: application?.applicantActors?.[0]
          ? application.applicant
          : answers.applicant.nationalId,
      },
      collectionId: parliamentaryCollection.id,
      areas: answers.constituency.map((constituency) => {
        const [id, _name] = constituency.split('|')
        return {
          areaId: id,
        }
      }),
    }

    const result = await this.signatureCollectionClientService
      .createParliamentaryCandidacy(input, auth)
      .catch((error) => {
        throw new TemplateApiError(
          {
            summary: error.message,
            title: errorMessages.partyBallotLetter.title,
          },
          500,
        )
      })

    try {
      // Use the shared service to send an email using a custom email generator
      await this.sharedTemplateAPIService.sendEmail(
        generateApplicationSubmittedEmail,
        application,
      )
    } catch (e) {
      this.logger.warn(
        'Could not send submit email to admins for parlimentary list creation application: ',
        application.id,
      )
    }

    return {
      success: true,
      slug: result.slug,
    }
  }
}
