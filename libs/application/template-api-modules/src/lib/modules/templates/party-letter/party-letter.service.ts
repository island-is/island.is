import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignMinistryOfJusticeApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { PartyLetterRegistryApi } from './gen/fetch/party-letter'
import {
  EndorsementListApi,
  EndorsementMetadataDtoFieldEnum,
  EndorsementListTagsEnum,
} from './gen/fetch/endorsements'

const ONE_DAY_IN_SECONDS_EXPIRES = 24 * 60 * 60

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
export class PartyLetterService {
  constructor(
    private partyLetterRegistryApi: PartyLetterRegistryApi,
    private endorsementListApi: EndorsementListApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  partyLetterRegistryApiWithAuth(token: string) {
    return this.partyLetterRegistryApi.withMiddleware(
      new ForwardAuthHeaderMiddleware(token),
    )
  }

  endorsementListApiWithAuth(token: string) {
    return this.endorsementListApi.withMiddleware(
      new ForwardAuthHeaderMiddleware(token),
    )
  }

  async assignMinistryOfJustice({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(authorization)
      .endorsementListControllerClose({ listId })
      .then(async () => {
        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          generateAssignMinistryOfJusticeApplicationEmail,
          application,
          ONE_DAY_IN_SECONDS_EXPIRES,
        )
      })
      .catch(() => {
        this.logger.error('Failed to close endorsement list', listId)
        throw new Error('Failed to close endorsement list')
      })
  }

  async applicationRejected({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.endorsementListApiWithAuth(authorization)
      .endorsementListControllerOpen({ listId })
      .then(async () => {
        // if we succeed in creating the party letter let the applicant know
        await this.sharedTemplateAPIService.sendEmail(
          generateApplicationRejectedEmail,
          application,
        )
      })
      .catch(() => {
        this.logger.error('Failed to open endorsement list', listId)
        throw new Error('Failed to open endorsement list')
      })
  }

  async applicationApproved({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: application.answers.partyName,
          description: application.answers.partyLetter,
          endorsementMetadata: [
            { field: EndorsementMetadataDtoFieldEnum.fullName },
            { field: EndorsementMetadataDtoFieldEnum.signedTags },
            { field: EndorsementMetadataDtoFieldEnum.address },
          ],
          tags: [EndorsementListTagsEnum.partyLetter2021],
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

  async submitPartyLetter({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    return await this.partyLetterRegistryApiWithAuth(
      authorization,
    ).partyLetterRegistryControllerCreate({
      createDto: {
        partyLetter: application.answers.partyLetter as string,
        partyName: application.answers.partyName as string,
        managers: [],
        owner: application.applicant,
      },
    })
  }
}
