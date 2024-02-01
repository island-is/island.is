import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { CaseSignatureType } from './models/caseSignature.type'
import { SearchCaseTemplateInput } from './models/searchCaseTemplate.input'
import {
  DmrClientService,
  JournalControllerValidateRequest,
  JournalValidateSuccessResponse,
} from '@island.is/clients/dmr'

const MockTemplates = [
  {
    department: '0',
    category: '2',
    subCategory: '0',
    title:
      'REGLUGERÐ um breytingu á reglugerð um skipulagsmál í Reykjavíkurborg',
    template: '',
    documentContents:
      '<div><h1>REGLUGERÐ</h1><p>Lorem ipsum dolor sit amet</p></div>',
    signatureType: '0',
    signatureContents: 'Jón Bjarni',
  },
]

@Injectable()
export class MinistryOfJusticeService {
  constructor(private readonly dmrClientService: DmrClientService) {}

  async validateAdvert(
    auth: User,
    advert: JournalControllerValidateRequest,
  ): Promise<JournalValidateSuccessResponse> {
    console.log('from ministry of justice service:', advert)
    const results = await this.dmrClientService.validateAdvert(auth, advert)
    console.log(results)
    return results
  }

  async submitApplication(auth: User): Promise<JournalValidateSuccessResponse> {
    throw new Error('Method not implemented.')
  }

  async getOptions(auth: User) {
    return {
      data: {
        departments: [
          { value: '0', label: 'A-deild' },
          { value: '1', label: 'B-deild' },
          { value: '2', label: 'C-deild' },
        ],
        categories: [
          { value: '0', label: 'Gjaldskrá' },
          { value: '1', label: 'Auglýsing' },
          { value: '2', label: 'Reglugerð' },
          { value: '3', label: 'Skipulagsskrá' },
          { value: '4', label: 'Fjallskilasamþykkt' },
          { value: '5', label: 'Reglur' },
          { value: '6', label: 'Samþykkt' },
        ],
        subCategories: [
          { value: '0', label: 'Skipulagsreglugerð' },
          { value: '1', label: 'Byggingarreglugerð' },
          { value: '2', label: 'Hafnarreglugerð' },
        ],
      },
    }
  }

  async searchCaseTemplates(user: User, input: SearchCaseTemplateInput) {
    const { q } = input

    if (!q) {
      return {
        data: MockTemplates,
        totalCount: MockTemplates.length,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
      }
    }

    const templates = MockTemplates.filter((template) => {
      if (!template.title) return false
      return template.title?.toLowerCase().indexOf(q.toLowerCase()) > -1
    })
      .filter(isDefined)
      .map((template) => ({
        ...template,
        signatureType: CaseSignatureType.MINISTER,
      }))

    return {
      data: templates,
      totalCount: templates.length,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }
}
