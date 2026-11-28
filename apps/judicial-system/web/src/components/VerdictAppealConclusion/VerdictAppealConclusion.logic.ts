import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { getAppealRulingTypeWording } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/VerdictAppealStatus/RegisterConclusion.logic'

export interface VerdictAppealConclusionContent {
  title: string
  text: string
}

/**
 * The Court of Appeals' concluding words on a verdict appeal, titled after
 * whether the court ended it with a verdict or a ruling. They are shown only
 * once the appeal is completed and its outcome released.
 */
export const getVerdictAppealConclusion = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
): VerdictAppealConclusionContent | undefined => {
  const appeal = workingCase.verdictAppealCase

  if (
    appeal?.appealState !== AppealCaseState.COMPLETED ||
    !appeal.appealConclusion
  ) {
    return undefined
  }

  return {
    title: getAppealRulingTypeWording(appeal.appealRulingType).courtConclusion,
    text: appeal.appealConclusion,
  }
}
