import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  EndorsementListApi,
  EndorsementMetadataDtoFieldEnum,
  EndorsementListTagsEnum,
} from './gen/fetch/endorsements'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { getValueViaPath } from '@island.is/application/core'

const CREATE_ENDORSEMENT_LIST_QUERY = `
  mutation EndorsementSystemCreateEndorsementList($input: CreateEndorsementListDto!) {
    endorsementSystemCreateEndorsementList(input: $input) {
      id
    }
  }
`

interface EndorsementListData {
  endorsementSystemCreateEndorsementList: {
    id: string
  }
}

@Injectable()
export class GeneralPetitionService {
  constructor(
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  endorsementListApiWithAuth(token: string) {
    return this.endorsementListApi.withMiddleware(
      new AuthHeaderMiddleware(token),
    )
  }

  async createEndorsementList({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { dateFrom, dateTil } = getValueViaPath(
      application.answers,
      'dates',
    ) as { dateFrom: string; dateTil: string }
    const endorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery<EndorsementListData>(
        auth.authorization,
        CREATE_ENDORSEMENT_LIST_QUERY,
        {
          input: {
            title: application.answers.listName,
            description: application.answers.aboutList,
            endorsementMetadata: [
              { field: EndorsementMetadataDtoFieldEnum.fullName },
            ],
            tags: [EndorsementListTagsEnum.generalPetition],
            meta: {
              // to be able to link back to this application
              applicationTypeId: application.typeId,
              applicationId: application.id,
            },
            closedDate: dateTil,
            openedDate: dateFrom,
            adminLock: false,
          },
        },
      )
      .then((response) => response.json())

    if ('errors' in endorsementListResponse) {
      this.logger.error(
        'Failed to create endorsement list',
        endorsementListResponse,
      )
      throw new Error('Failed to create endorsement list')
    }

    // This gets written to externalData under the key createEndorsementList
    return {
      id:
        endorsementListResponse.data?.endorsementSystemCreateEndorsementList.id,
    }
  }
}
