import { Injectable } from '@nestjs/common'
import { PoliceCasesClientService } from '@island.is/clients/police-cases'
import type { User } from '@island.is/auth-nest-tools'
import { Case } from '../models/police-cases/case.model'
import { mapPoliceCase } from '../mappers/policeCaseMapper'
import { isDefined } from '@island.is/shared/utils'
import { PaginatedCaseCollection } from '../models/police-cases/paginatedCaseCollection.model'
import { IntlService } from '@island.is/cms-translations'
import {
  NAMESPACE,
  POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP,
} from '../types/constants'
import type { Locale } from '@island.is/shared/types'
import { m } from '../messages'
import { PoliceCaseStatusValueGroup } from '../types/enums'
import { CaseTimelineStructure } from '../models/police-cases/caseTimelineStructure.model'

@Injectable()
export class PoliceCasesService {
  constructor(
    private policeApi: PoliceCasesClientService,
    private readonly intlService: IntlService,
  ) {}

  async getCases(user: User, locale: Locale): Promise<PaginatedCaseCollection> {
    const { formatMessage } = await this.intlService.useIntl(NAMESPACE, locale)

    const cases = await this.policeApi.getCases(user)

    if (!cases) {
      return {
        data: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    }

    const mappedCases = cases
      .map((item) => mapPoliceCase(item, locale, formatMessage))
      .filter(isDefined)

    return {
      data: mappedCases,
      totalCount: mappedCases.length,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  async getCase(
    user: User,
    caseNumber: string,
    locale: Locale,
  ): Promise<Case | undefined> {
    const { formatMessage } = await this.intlService.useIntl(NAMESPACE, locale)
    const cases = await this.policeApi.getCases(user)

    if (!cases) {
      return undefined
    }

    const policeCase = cases.find((c) => c.caseNumber === caseNumber)
    return policeCase
      ? mapPoliceCase(policeCase, locale, formatMessage) ?? undefined
      : undefined
  }

  async getCaseTimelineStructure(
    locale: Locale,
  ): Promise<CaseTimelineStructure> {
    const { formatMessage } = await this.intlService.useIntl(NAMESPACE, locale)

    return {
      milestones: [
        {
          cacheId: `first-step-${locale}`,
          step: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[
            PoliceCaseStatusValueGroup.POLICE_ANALYSIS
          ],
          statusGroup: PoliceCaseStatusValueGroup.POLICE_ANALYSIS,
          label: formatMessage(m.policeAnalysis),
        },
        {
          cacheId: `second-step-${locale}`,
          step: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[
            PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION
          ],
          statusGroup: PoliceCaseStatusValueGroup.CRIMINAL_INVESTIGATION,
          label: formatMessage(m.criminalInvestigation),
        },
        {
          cacheId: `third-step-${locale}`,
          step: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[
            PoliceCaseStatusValueGroup.POST_INVESTIGATION
          ],
          statusGroup: PoliceCaseStatusValueGroup.POST_INVESTIGATION,
          label: formatMessage(m.postInvestigation),
        },
        {
          cacheId: `fourth-step-${locale}`,
          step: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[
            PoliceCaseStatusValueGroup.INDICTMENT
          ],
          statusGroup: PoliceCaseStatusValueGroup.INDICTMENT,
          label: formatMessage(m.indictment),
        },
        {
          cacheId: `fifth-step-${locale}`,
          step: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[
            PoliceCaseStatusValueGroup.SENT_TO_COURT
          ],
          statusGroup: PoliceCaseStatusValueGroup.SENT_TO_COURT,
          label: formatMessage(m.caseSentToCourt),
        },
      ],
    }
  }
}
