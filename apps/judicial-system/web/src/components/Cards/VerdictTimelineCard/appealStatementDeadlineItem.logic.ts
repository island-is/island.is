import { formatDate } from '@island.is/judicial-system/formatters'
import {
  type AppealStatementParty,
  findAppealStatementDeadline,
} from '@island.is/judicial-system/types'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'

/**
 * Greinargerðarfrest for one party while the verdict appeal is still open.
 * Completed / withdrawn appeals leave the outcome off the timeline card.
 *
 * Expiry comes from the backend `isExpired` flag (whole-day rule).
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
