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
 * `isExpired` is set by the defence limited-access interceptor; when it is
 * missing (full-access prosecution payloads), fall back to the client clock.
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

  const isExpired =
    statementDeadline.isExpired ??
    Date.now() >= new Date(statementDeadline.deadline).getTime()

  return {
    text: `Frestur til að skila greinargerð ${
      isExpired ? 'rann út' : 'er til'
    } ${formatDate(statementDeadline.deadline)}`,
  }
}
