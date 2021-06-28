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

const CLOSE_ENDORSEMENT = `
  mutation EndorsementSystemCloseEndorsementList($input: FindEndorsementListInput!) {
    endorsementSystemCloseEndorsementList(input: $input) {
      id
      closedDate
    }
  }
`

const OPEN_ENDORSEMENT = `
  mutation EndorsementSystemOpenEndorsementList($input: FindEndorsementListInput!) {
    endorsementSystemOpenEndorsementList(input: $input) {
      id
      closedDate
    }
  }
`

const CREATE_ENDORSEMENT_LIST_QUERY = `
  mutation EndorsementSystemCreatePartyLetterEndorsementList($input: CreateEndorsementListDto!) {
    endorsementSystemCreateEndorsementList(input: $input) {
      id
    }
  }
`

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

type CreatePartyLetterResponse =
  | {
      data: {
        partyLetterRegistryCreate: {
          partyLetter: string
          partyName: string
        }
      }
    }
  | ErrorResponse
@Injectable()
export class PartyLetterService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignMinistryOfJustice({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CLOSE_ENDORSEMENT, {
        input: {
          listId,
        },
      })
      .then((res) => {
        return res.json()
      })
      .then(async (json) => {
        if (json.errors) {
          this.logger.error('Failed to close endorsement list', listId)
          throw new Error('Failed to close endorsement list')
        }
        if (json.data) {
          await this.sharedTemplateAPIService.assignApplicationThroughEmail(
            generateAssignMinistryOfJusticeApplicationEmail,
            application,
          )
        }
      })
  }

  async applicationRejected({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const listId = (application.externalData?.createEndorsementList.data as any)
      .id

    return this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, OPEN_ENDORSEMENT, {
        input: {
          listId,
        },
      })
      .then((res) => {
        return res.json()
      })
      .then(async (json) => {
        if (json.errors) {
          this.logger.error('Failed to open endorsement list', listId)
          throw new Error('Failed to open endorsement list')
        }
        if (json.data) {
          await this.sharedTemplateAPIService.sendEmail(
            generateApplicationRejectedEmail,
            application,
          )
        }
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
          endorsementMeta: ['fullName', 'address', 'signedTags'],
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
      this.logger.error('Failed to open endorsement list', endorsementList)
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
    const CREATE_PARTY_LETTER_QUERY = `
    mutation {
      partyLetterRegistryCreate(input: {
        partyLetter: "${application.answers.partyLetter}",
        partyName: "${application.answers.partyName}",
        managers: []
      }) {
        partyName
        partyLetter
      }
    }
    `

    const partyLetter: CreatePartyLetterResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_PARTY_LETTER_QUERY)
      .then((response) => response.json())

    if ('errors' in partyLetter) {
      this.logger.error('Failed to register party letter', partyLetter)
      throw new Error('Failed to register party letter')
    }

    return partyLetter
  }
}
