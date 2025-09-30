import { Injectable } from '@nestjs/common'
import { PoliceCasesClientService } from '@island.is/clients/police-cases'
import type { User } from '@island.is/auth-nest-tools'
import { mapPoliceCase } from '../mappers/policeCaseMapper'
import { isDefined } from '@island.is/shared/utils'
import { PaginantedCaseCollection } from '../models/police-cases/paginatedCaseCollection.model'
import { IntlService } from '@island.is/cms-translations'
import { NAMESPACE } from '../types/constants'
import type { Locale } from '@island.is/shared/types'

@Injectable()
export class PoliceCasesService {
  constructor(
    private policeApi: PoliceCasesClientService,
    private readonly intlService: IntlService,
  ) {}

  async getCases(user: User, locale: Locale): Promise<PaginantedCaseCollection> {
    const { formatMessage } = await this.intlService.useIntl(NAMESPACE, locale)

    const cases = await this.policeApi.getCases(user)

    if (!cases || cases.length <= 0) {
      return {
        data: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    }

    return {
      data: cases.map(item => mapPoliceCase(item, formatMessage)).filter(isDefined) ?? [],
      totalCount: cases.length,
      pageInfo: {
        //temporary
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  async getCase(user: User, caseNumber: string, locale: Locale) {
    const cases = await this.getCases(user, locale)
    return cases.data.find((c) => c.number === caseNumber)
  }
}
