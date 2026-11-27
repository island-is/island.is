import type { InstitutionUser } from '@island.is/judicial-system/types'
import {
  isCourtOfAppealsUser,
  isPrisonSystemUser,
  isVerdictAppealConfirmed,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { getVerdictAppealRulingDecisionLabel } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/VerdictAppealSummary/VerdictAppealSummary.logic'
import { resolveTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks/useTargetAppealCaseByAppealCaseId'

/**
 * Whether the card shows how a verdict appeal ended. The Court of Appeals sees
 * it once the court has confirmed the appeal (ready to complete or completed);
 * every other user only once the appeal is completed and its outcome released.
 */
export const shouldShowVerdictAppealOutcome = (
  appealCase:
    | Pick<AppealCase, 'appealType' | 'appealState' | 'appealRulingDecision'>
    | undefined
    | null,
  user?: InstitutionUser,
): boolean =>
  Boolean(
    appealCase?.appealType === AppealCaseType.VERDICT &&
      (isCourtOfAppealsUser(user)
        ? isVerdictAppealConfirmed(appealCase)
        : appealCase.appealState === AppealCaseState.COMPLETED) &&
      getVerdictAppealRulingDecisionLabel(appealCase),
  )

/**
 * The appeal the card's Court of Appeals section describes. An appeal passed
 * in by the page wins, null meaning there is none. Otherwise the appeal named
 * by `appealCaseId` in the query string, and with none named, the case level
 * appeal, then the verdict appeal once it is completed - so the parties see
 * how a verdict appeal ended on their own overview of the case. Prison system
 * users do not get that last fallback to the verdict appeal.
 */
export const resolveClosedIndictmentAppealCase = (
  workingCase: WorkingCase,
  appealCase: AppealCase | null | undefined,
  appealCaseId: string | undefined,
  user?: InstitutionUser,
): AppealCase | null | undefined => {
  if (appealCase !== undefined) {
    return appealCase
  }

  if (appealCaseId) {
    return resolveTargetAppealCaseByAppealCaseId(workingCase, appealCaseId)
  }

  if (workingCase.appealCase) {
    return workingCase.appealCase
  }

  if (isPrisonSystemUser(user)) {
    return undefined
  }

  return workingCase.verdictAppealCase?.appealState ===
    AppealCaseState.COMPLETED
    ? workingCase.verdictAppealCase
    : undefined
}
