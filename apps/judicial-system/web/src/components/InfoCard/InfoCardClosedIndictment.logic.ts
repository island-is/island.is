import type { InstitutionUser } from '@island.is/judicial-system/types'
import { isCourtOfAppealsUser } from '@island.is/judicial-system/types'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { getVerdictAppealRulingDecisionLabel } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/VerdictAppealSummary/VerdictAppealSummary.logic'

/**
 * Whether the card shows how a verdict appeal ended, which it does once the
 * court has confirmed the appeal. Only the Court of Appeals sees it: the
 * outcome is not for other users' eyes.
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
      appealCase.appealState === AppealCaseState.COMPLETED &&
      getVerdictAppealRulingDecisionLabel(appealCase) &&
      isCourtOfAppealsUser(user),
  )
