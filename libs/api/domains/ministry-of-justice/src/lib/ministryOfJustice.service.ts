import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { CaseSignatureType } from './models/caseSignature.type'
import { SearchCaseTemplateInput } from './models/searchCaseTemplate.input'
import { PaginatedSearchCaseTemplateResponse } from './models/searchCaseTemplate.response'
import { Case } from './models/case.model'

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
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

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
