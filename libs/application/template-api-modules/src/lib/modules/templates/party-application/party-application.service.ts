import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { generateAssignSupremeCourtApplicationEmail } from './emailGenerators'
import {
  EndorsementListTagsEnum,
  Constituencies,
} from '@island.is/application/templates/party-application'

interface CreateEndorsementListResponse {
  data: {
    endorsementSystemCreateEndorsementList: {
      id: string
    }
  }
}

const constituencyMapper: Record<Constituencies, EndorsementListTagsEnum> = {
  [Constituencies.NORTH_EAST]:
    EndorsementListTagsEnum.PartyApplicationNordausturkjordaemi2021,
  [Constituencies.NORTH_WEST]:
    EndorsementListTagsEnum.PartyApplicationNordvesturkjordaemi2021,
  [Constituencies.RVK_NORTH]:
    EndorsementListTagsEnum.PartyApplicationReykjavikurkjordaemiNordur2021,
  [Constituencies.RVK_SOUTH]:
    EndorsementListTagsEnum.PartyApplicationReykjavikurkjordaemiSudur2021,
  [Constituencies.SOUTH]:
    EndorsementListTagsEnum.PartyApplicationSudurkjordaemi2021,
  [Constituencies.SOUTH_WEST]:
    EndorsementListTagsEnum.PartyApplicationSudvesturkjordaemi2021,
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

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const constituencyTag =
      constituencyMapper[application.answers.constituency as Constituencies]
    const CREATE_ENDORSEMENT_LIST_QUERY = `
      mutation {
        endorsementSystemCreateEndorsementList(input: {
          title: "${application.answers.partyName}",
          description: "${application.answers.partyLetter}",
          endorsementMeta: [fullName, address, signedTags],
          tags: [${constituencyTag}],
          validationRules: [],
        }) {
          id
        }
      }
    `

    const endorsementList: CreateEndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY)
      .then((response) => response.json())

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }
}
