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
 * Expiry comes from the backend `isExpired` flag (whole-day rule). Outside
 * the court of appeals, an appeal the court has confirmed but not completed
 * arrives as APPEALED with its deadlines, so its bullet stays exactly as on an
 * appeal under advisement until the appeal is completed and its outcome
 * released.
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
