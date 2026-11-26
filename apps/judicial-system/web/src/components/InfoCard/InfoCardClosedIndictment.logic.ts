import type { InstitutionUser } from '@island.is/judicial-system/types'
import {
  isCourtOfAppealsUser,
  isVerdictAppealConfirmed,
} from '@island.is/judicial-system/types'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { getVerdictAppealRulingDecisionLabel } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/VerdictAppealSummary/VerdictAppealSummary.logic'

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
