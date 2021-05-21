import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { Constituencies } from '@island.is/application/templates/party-application'

import { generateAssignSupremeCourtApplicationEmail } from './emailGenerators'

enum EndorsementListTagsEnum {
  partyLetter2021,
  partyLetterNordausturkjordaemi2021,
  partyLetterNordvesturkjordaemi2021,
  partyLetterReykjavikurkjordaemiNordur2021,
  partyLetterReykjavikurkjordaemiSudur2021,
  partyLetterSudurkjordaemi2021,
  partyLetterSudvesturkjordaemi2021,
}

interface CreateEndorsementListResponse {
  data: {
    endorsementSystemCreateEndorsementList: {
      id: string
    }
  }
}

const constituencyMapper: Record<
  Constituencies,
  keyof typeof EndorsementListTagsEnum
> = {
  Norðausturkjördæmi: 'partyLetter2021',
  Norðvesturkjördæmi: 'partyLetterNordvesturkjordaemi2021',
  'Reykjavíkurkjördæmi norður': 'partyLetterReykjavikurkjordaemiNordur2021',
  'Reykjavíkurkjördæmi suður': 'partyLetterReykjavikurkjordaemiSudur2021',
  Suðurkjördæmi: 'partyLetterSudurkjordaemi2021',
  Suðvesturkjördæmi: 'partyLetterSudvesturkjordaemi2021',
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
