import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignSupremeCourtApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { Constituencies } from '@island.is/application/templates/party-application'
import { EndorsementListTagsEnum } from './gen/fetch'

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

interface PartyLetterData {
  partyName: string
  partyLetter: string
}

const constituencyMapper: Record<Constituencies, EndorsementListTagsEnum> = {
  [Constituencies.NORTH_EAST]:
    EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021,
  [Constituencies.NORTH_WEST]:
    EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021,
  [Constituencies.RVK_NORTH]:
    EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021,
  [Constituencies.RVK_SOUTH]:
    EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021,
  [Constituencies.SOUTH]:
    EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021,
  [Constituencies.SOUTH_WEST]:
    EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021,
}

@Injectable()
export class PartyApplicationService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignSupremeCourt({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignSupremeCourtApplicationEmail,
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
    const constituencyTag =
      constituencyMapper[application.answers.constituency as Constituencies]
    const CREATE_ENDORSEMENT_LIST_QUERY = `
      mutation EndorsementSystemCreateEndorsementList($input: CreateEndorsementListDto!) {
        endorsementSystemCreateEndorsementList(input: $input) {
          id
        }
      }
    `

    const partyLetter = application.externalData.partyLetterRegistry
      ?.data as PartyLetterData
    const endorsementList: CreateEndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: partyLetter.partyName,
          description: partyLetter.partyLetter,
          endorsementMeta: ['fullName', 'address', 'signedTags'],
          tags: [constituencyTag],
          validationRules: [
            {
              type: 'minAgeAtDate',
              value: {
                date: '2021-09-25T00:00:00Z',
                age: 18,
              },
            },
            {
              type: 'uniqueWithinTags',
              value: {
                tags: [
                  'partyLetter2021'

                ],
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
}
