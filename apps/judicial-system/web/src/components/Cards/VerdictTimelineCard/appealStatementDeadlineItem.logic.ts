import { formatDate } from '@island.is/judicial-system/formatters'
import {
  type AppealStatementParty,
  findAppealStatementDeadline,
} from '@island.is/judicial-system/types'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'

/**
 * Statement deadline for one party while the verdict appeal is still open.
 * Completed / withdrawn appeals leave the outcome off the timeline card.
 *
 * Expiry comes from the backend `isExpired` flag (whole-day rule). For
 * non-court-of-appeals users, completed appeals are masked as APPEALED and
 * statementDeadlines are stripped server-side, so this COMPLETED check mainly
 * covers court-of-appeals viewers who still receive the real state.
 */
export const getOpenAppealStatementDeadlineItem = (
  verdictAppealCase:
    | Pick<AppealCase, 'appealState' | 'statementDeadlines'>
    | null
    | undefined,
  party: AppealStatementParty,
): VerdictTimelineItem | undefined => {
  if (
    verdictAppealCase?.appealState === AppealCaseState.COMPLETED ||
    verdictAppealCase?.appealState === AppealCaseState.WITHDRAWN
  ) {
    return undefined
  }

  const statementDeadline = findAppealStatementDeadline(
    verdictAppealCase?.statementDeadlines,
    party,
  )

  if (!statementDeadline?.deadline) {
    return undefined
  }

  return {
    text: `Frestur til að skila greinargerð ${
      statementDeadline.isExpired ? 'rann út' : 'er til'
    } ${formatDate(statementDeadline.deadline)}`,
  }
}
