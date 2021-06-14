import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignMinistryOfJusticeApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'

type ErrorResponse = {
  errors: {
    message: string
  }
}
type CreateEndorsementListResponse =
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
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignMinistryOfJustice({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignMinistryOfJusticeApplicationEmail,
      application,
    )
  }

  async applicationRejected({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationRejectedEmail,
      application,
    )
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
    const CREATE_ENDORSEMENT_LIST_QUERY = `
      mutation EndorsementSystemCreateEndorsementList($input: CreateEndorsementListDto!) {
        endorsementSystemCreateEndorsementList(input: $input) {
          id
        }
      }
    `

    const endorsementList: CreateEndorsementListResponse = await this.sharedTemplateAPIService
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
        },
      })
      .then((response) => response.json())

    if ('errors' in endorsementList) {
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
      throw new Error('Failed to register party letter')
    }

    return partyLetter
  }
}
