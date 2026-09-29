import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTableType } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { resolveTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks/useTargetAppealCaseByAppealCaseId'

// The court of appeals' verdict appeal lists. Both open the same page - it is
// written to read for an appeal that has just arrived and for one that is
// finished.
const verdictAppealCaseTableTypes: CaseTableType[] = [
  CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
  CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
]

/**
 * Which page a court of appeals row opens, and whether the appeal it refers to
 * has to be named in the query string.
 *
 * Which list the row came from is what separates a verdict appeal from a
 * ruling appeal - not the case, which can carry one of each at the same time.
 *
 * A verdict appeal needs no `appealCaseId`: `verdictAppealCase` is a HasOne, so
 * the page has only one appeal to show. The ruling appeal pages do need it,
 * because a case can carry a case-level appeal and an appeal of each ruling
 * order, and the row says which of them it is.
 */
export const getCourtOfAppealsRouteForRow = (
  caseToOpen: WorkingCase,
  appealCaseId?: string | null,
  caseTableType?: CaseTableType | null,
): { route: string; withAppealCaseId: boolean } => {
  if (caseTableType && verdictAppealCaseTableTypes.includes(caseTableType)) {
    return {
      route: COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
      withAppealCaseId: false,
    }
  }

  const targetAppealCase = resolveTargetAppealCaseByAppealCaseId(
    caseToOpen,
    appealCaseId ?? undefined,
  )

  return {
    route:
      targetAppealCase?.appealState === AppealCaseState.COMPLETED
        ? COURT_OF_APPEAL_RESULT_ROUTE
        : COURT_OF_APPEAL_OVERVIEW_ROUTE,
    withAppealCaseId: true,
  }
}
