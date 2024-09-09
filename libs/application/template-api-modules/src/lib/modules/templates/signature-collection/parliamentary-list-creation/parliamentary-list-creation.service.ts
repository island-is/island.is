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
import { CollectionType } from '@island.is/clients/signature-collection'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class ParliamentaryListCreationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly _sharedTemplateAPIService: SharedTemplateApiService,
    private signatureCollectionClientService: SignatureCollectionClientService,
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

    return currentCollection
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
          areas: answers.constituency.map((constituency) => {
            const [id, name] = constituency.split('|')
            return {
              areaId: id,
            }
          }),
        }))
        .concat(
          answers.supervisors.map((supervisor) => ({
            nationalId: supervisor.supervisor.nationalId,
            phoneNumber: '',
            mandateType: MandateType.Administrator,
            email: '',
            areas: supervisor.constituency.map((constituency) => {
              const [id, name] = constituency.split('|')
              return {
                areaId: id,
              }
            }),
          })),
        ),
      // TODO: determine collectionID
      collectionId: '',
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
