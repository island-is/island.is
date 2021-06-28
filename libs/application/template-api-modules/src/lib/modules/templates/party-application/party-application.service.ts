import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignSupremeCourtApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { EndorsementListTagsEnum } from './gen/fetch'

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

interface PartyLetterData {
  partyName: string
  partyLetter: string
}

@Injectable()
export class PartyApplicationService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignSupremeCourt({
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
          throw new Error('Failed to close endorsement list')
        }
        if (json.data) {
          await this.sharedTemplateAPIService.assignApplicationThroughEmail(
            generateAssignSupremeCourtApplicationEmail,
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
    const partyLetter = application.externalData.partyLetterRegistry
      ?.data as PartyLetterData
    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: partyLetter.partyName,
          description: partyLetter.partyLetter,
          endorsementMeta: ['fullName', 'address', 'signedTags'],
          tags: [application.answers.constituency as EndorsementListTagsEnum],
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
                  EndorsementListTagsEnum.partyApplicationNordausturkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationNordvesturkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiNordur2021,
                  EndorsementListTagsEnum.partyApplicationReykjavikurkjordaemiSudur2021,
                  EndorsementListTagsEnum.partyApplicationSudurkjordaemi2021,
                  EndorsementListTagsEnum.partyApplicationSudvesturkjordaemi2021,
                ],
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
      throw new Error('Failed to create endorsement list')
    }

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }
}
