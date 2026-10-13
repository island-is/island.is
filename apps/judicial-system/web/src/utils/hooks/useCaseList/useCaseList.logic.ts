import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { resolveTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks/useTargetAppealCaseByAppealCaseId'

/**
 * Which page a court of appeals row opens.
 *
 * The appeal named in the query string settles it. A case can carry a
 * case-level ruling appeal, an appeal of each ruling order and a verdict
 * appeal at once, so the case cannot say which proceeding a row is about -
 * but the appeal can, because a verdict appeal is one by type.
 *
 * The stepper picks its sections by the same test, so a row and the page it
 * opens cannot disagree about which proceeding the reader is in.
 */
export const getCourtOfAppealsRouteForRow = (
  caseToOpen: WorkingCase,
  appealCaseId?: string | null,
): string => {
  const targetAppealCase = resolveTargetAppealCaseByAppealCaseId(
    caseToOpen,
    appealCaseId ?? undefined,
  )

  if (targetAppealCase?.appealType === AppealCaseType.VERDICT) {
    return COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE
  }

  return targetAppealCase?.appealState === AppealCaseState.COMPLETED
    ? COURT_OF_APPEAL_RESULT_ROUTE
    : COURT_OF_APPEAL_OVERVIEW_ROUTE
}
