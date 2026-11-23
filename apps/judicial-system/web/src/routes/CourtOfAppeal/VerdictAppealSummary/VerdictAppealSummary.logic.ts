import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  CaseFileCategory,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isVerdictAppealConclusionFieldsValid } from '@island.is/judicial-system-web/src/utils/validate'

import { appealRulingDecisionOptions } from '../VerdictAppealStatus/RegisterConclusion.logic'

/** The document the Court of Appeals ended the appeal with. */
export const getVerdictAppealRulingFiles = (
  theCase: Pick<WorkingCase, 'caseFiles'>,
): CaseFile[] =>
  (theCase.caseFiles ?? []).filter(
    (file) => file.category === CaseFileCategory.VERDICT_APPEAL_RULING,
  )

/** How the appeal ended, in the words the court chose it by. */
export const getVerdictAppealRulingDecisionLabel = (
  theCase: Pick<WorkingCase, 'verdictAppealCase'>,
): string | undefined => {
  const decision = theCase.verdictAppealCase?.appealRulingDecision

  return decision
    ? appealRulingDecisionOptions.find((option) => option.decision === decision)
        ?.label
    : undefined
}

/**
 * Whether the court can confirm the appeal as finished: it is still open,
 * the court has marked it "Lokið", and everything the backend asks of a
 * finished appeal is on record - the outcome, its type, the concluding words
 * and the document.
 */
export const canCompleteVerdictAppeal = (
  theCase: Pick<WorkingCase, 'verdictAppealCase' | 'caseFiles'>,
): boolean => {
  const appeal = theCase.verdictAppealCase

  return Boolean(
    appeal &&
      appeal.appealState === AppealCaseState.APPEALED &&
      appeal.verdictAppealStatus === VerdictAppealStatus.COMPLETED &&
      isVerdictAppealConclusionFieldsValid(appeal) &&
      getVerdictAppealRulingFiles(theCase).length > 0,
  )
}
