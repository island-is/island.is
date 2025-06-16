import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  Collection,
  CollectionType,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { errorMessages } from '@island.is/application/templates/signature-collection/municipal-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/municipal-list-creation'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { isCompany } from 'kennitala'
import { coreErrorMessages } from '@island.is/application/core'
import { generateApplicationSubmittedEmail } from './emailGenerators'
import { AuthDelegationType } from '@island.is/shared/types'
import { getCollectionTypeFromApplicationType } from '../shared/utils'
@Injectable()
export class MunicipalListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
    private nationalRegistryClientService: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.MUNICIPAL_LIST_CREATION)
  }
  private collectionType = getCollectionTypeFromApplicationType(
    ApplicationTypes.MUNICIPAL_LIST_CREATION,
  )
  async candidate({ auth }: TemplateApiModuleActionProps) {
    const candidate = await this.signatureCollectionClientService.getSignee(
      auth,
      this.collectionType,
    )

    // TODO: Is this relevant for LocalGovernmental/Municipal Elections?
    if (!candidate.hasPartyBallotLetter) {
      throw new TemplateApiError(errorMessages.partyBallotLetter, 405)
    }

    return candidate
  }

  async municipalCollection({ auth }: TemplateApiModuleActionProps) {
    const candidate = await this.signatureCollectionClientService.getSignee(
      auth,
      this.collectionType,
    )

    const currentCollection = (
      await this.signatureCollectionClientService.currentCollection(
        CollectionType.LocalGovernmental,
      )
    )
      .filter((collection) => collection.isActive)
      .filter(
        (collection) =>
          collection.collectionType === this.collectionType &&
          collection.areas.some((area) => area.id === candidate.area?.id),
      )

    if (!currentCollection.length) {
      throw new TemplateApiError(
        errorMessages.currentCollectionNotMunicipal,
        405,
      )
    }

    // Candidates are stored on user national id never the actors so should be able to check just the auth national id
    if (
      currentCollection.some((collection) =>
        collection.candidates.some(
          (candidate) =>
            candidate.nationalId.replace('-', '') === auth.nationalId,
        ),
      )
    ) {
      throw new TemplateApiError(errorMessages.alreadyCandidate, 412)
    }

    return currentCollection
  }

  async municipalIdentity({ auth }: TemplateApiModuleActionProps) {
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
    const municipalCollection = (
      application.externalData.municipalCollection.data as Array<Collection>
    )[0]

    const input = {
      collectionType: this.collectionType,
      collectionId: municipalCollection.id,
      owner: {
        ...answers.applicant,
        nationalId: application?.applicantActors?.[0]
          ? application.applicant
          : answers.applicant.nationalId,
      },
      listName: answers?.list?.name ?? '',
    }

    const result = await this.signatureCollectionClientService
      .createMunicipalCandidacy(input, auth)
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
        'Could not send submit email to admins for municipal list creation application: ',
        application.id,
      )
    }

    return {
      success: true,
      slug: result.slug,
    }
  }
}
