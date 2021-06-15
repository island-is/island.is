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
import { getSlugFromType } from '@island.is/application/core'

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

  async assignSupremeCourt({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const CLOSE_ENDORSEMENT = `
    mutation {
      endorsementSystemCloseEndorsementList(input: {
        listId: "${
          (application.externalData?.createEndorsementList.data as any).id
        }",
      }) {
        id
        closedDate
      }
    }
  `
    const endorsementId: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CLOSE_ENDORSEMENT)
      .then((response) => response.json())

    if ('errors' in endorsementId) {
      throw new Error('Failed to close endorsement list')
    }

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignSupremeCourtApplicationEmail,
      application,
    )
  }

  async applicationRejected({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const OPEN_ENDORSEMENT = `
      mutation {
        endorsementSystemOpenEndorsementList(input: {
          listId: "${
            (application.externalData?.createEndorsementList.data as any).id
          }",
        }) {
          id
          closedDate
        }
      }
    `
    const endorsementId: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, OPEN_ENDORSEMENT)
      .then((response) => response.json())

    if ('errors' in endorsementId) {
      throw new Error('Failed to open endorsement list')
    }

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
      mutation EndorsementSystemCreatePartyApplicationEndorsementList($input: CreateEndorsementListDto!) {
        endorsementSystemCreateEndorsementList(input: $input) {
          id
        }
      }
    `
    const applicationSlug = getSlugFromType(application.typeId) as string
    const partyLetter = application.externalData.partyLetterRegistry
      ?.data as PartyLetterData
    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
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
            applicationTypeId: applicationSlug,
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
