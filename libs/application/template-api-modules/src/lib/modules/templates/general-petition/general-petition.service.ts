import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  EndorsementListApi,
  EndorsementMetadataDtoFieldEnum,
} from './gen/fetch/endorsements'

const CREATE_ENDORSEMENT_LIST_QUERY = `
  mutation EndorsementSystemCreatePartyLetterEndorsementList($input: CreateEndorsementListDto!) {
    endorsementSystemCreateEndorsementList(input: $input) {
      id
    }
  }
`

/**
 * We proxy the auth header to the subsystem where it is resolved.
 */
interface FetchParams {
  url: string
  init: RequestInit
}

interface RequestContext {
  init: RequestInit
}

interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}
class ForwardAuthHeaderMiddleware implements Middleware {
  constructor(private bearerToken: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.bearerToken,
    })
  }
}

type ErrorResponse = {
  errors: {
    message: string
  }
}
type EndorsementListResponse =
  | {
      data: {
        endorsementSystemCreateEndorsementList: {
          id: string
        }
      }
    }
  | ErrorResponse

@Injectable()
export class GeneralPetitionService {
  constructor(
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  endorsementListApiWithAuth(token: string) {
    return this.endorsementListApi.withMiddleware(
      new ForwardAuthHeaderMiddleware(token),
    )
  }

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: application.answers.listName,
          description: application.answers.aboutList,
          endorsementMetadata: [
            { field: EndorsementMetadataDtoFieldEnum.address },
          ],
          tags: ['partyLetter2021'],
          validationRules: [
            {
              type: 'minAge',
              value: {
                age: 18,
              },
            },
          ],
          meta: {
            // to be able to link back to this application
            applicationTypeId: application.typeId,
            applicationId: application.id,
          },
        },
      })
      .then((response) => response.json())

    if ('errors' in endorsementList) {
      this.logger.error('Failed to create endorsement list', endorsementList)
      throw new Error('Failed to create endorsement list')
    }

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }
}
