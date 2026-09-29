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
 * Which page a court of appeals row opens.
 *
 * Which list the row came from is what separates a verdict appeal from a
 * ruling appeal - not the case, which can carry one of each at the same time.
 *
 * The appeal itself always travels in the query string, whichever page opens,
 * so every screen answers "which appeal is this about" the same way.
 */
export const getCourtOfAppealsRouteForRow = (
  caseToOpen: WorkingCase,
  appealCaseId?: string | null,
  caseTableType?: CaseTableType | null,
): string => {
  if (caseTableType && verdictAppealCaseTableTypes.includes(caseTableType)) {
    return COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE
  }

  const targetAppealCase = resolveTargetAppealCaseByAppealCaseId(
    caseToOpen,
    appealCaseId ?? undefined,
  )

  return targetAppealCase?.appealState === AppealCaseState.COMPLETED
    ? COURT_OF_APPEAL_RESULT_ROUTE
    : COURT_OF_APPEAL_OVERVIEW_ROUTE
}
