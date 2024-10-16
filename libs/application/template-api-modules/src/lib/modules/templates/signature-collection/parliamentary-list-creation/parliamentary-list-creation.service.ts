import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  Collection,
  CreateParliamentaryCandidacyInput,
  MandateType,
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { errorMessages } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CollectionType } from '@island.is/clients/signature-collection'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { FetchError } from '@island.is/clients/middlewares'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { isCompany } from 'kennitala'
import { coreErrorMessages } from '@island.is/application/core'
import { AuthDelegationType } from '@island.is/shared/types'

@Injectable()
export class ParliamentaryListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly _sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
    private nationalRegisryClientService: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.PARLIAMENTARY_LIST_CREATION)
  }

  async candidate({ auth }: TemplateApiModuleActionProps) {
    const candidate = await this.signatureCollectionClientService.getSignee(
      auth,
    )

    if (!candidate.hasPartyBallotLetter) {
      throw new TemplateApiError(errorMessages.partyBallotLetter, 405)
    }

    return candidate
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
    const contactNationalId = isCompany(auth.nationalId)
      ? auth.actor?.nationalId ?? auth.nationalId
      : auth.nationalId

    if (
      currentCollection.candidates.some(
        (c) => c.nationalId.replace('-', '') === contactNationalId,
      )
    ) {
      throw new TemplateApiError(errorMessages.alreadyCandidate, 412)
    }

    return currentCollection
  }

  async parliamentaryIdentity({ auth }: TemplateApiModuleActionProps) {
    const contactNationalId = isCompany(auth.nationalId)
      ? auth.actor?.nationalId ?? auth.nationalId
      : auth.nationalId

    const identity = await this.nationalRegisryClientService.getIndividual(
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

    const input: CreateParliamentaryCandidacyInput = {
      owner: {
        ...answers.applicant,
        nationalId: application?.applicantActors?.[0]
          ? application.applicant
          : answers.applicant.nationalId,
      },
      agents: (answers.managers ?? [])
        .map((manager) => ({
          nationalId: manager.manager.nationalId,
          phoneNumber: '',
          mandateType: MandateType.Guarantor,
          email: '',
          areas: answers.constituency.map((constituency) => {
            const [id, _name] = constituency.split('|')
            return {
              areaId: id,
            }
          }),
        }))
        .concat(
          (answers.supervisors ?? []).map((supervisor) => ({
            nationalId: supervisor.supervisor.nationalId,
            phoneNumber: '',
            mandateType: MandateType.Administrator,
            email: '',
            areas: supervisor.constituency.map((constituency) => {
              const [id, _name] = constituency.split('|')
              return {
                areaId: id,
              }
            }),
          })),
        ),
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

    return {
      success: true,
      slug: result.slug,
    }
  }
}
