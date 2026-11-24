import { isStoredVerdictAppealRulingPdf } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  AppealCase,
  CaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
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

/** The ruling document the appeal can be completed with. */
export const getCompletableVerdictAppealRulingFile = (
  theCase: Pick<WorkingCase, 'caseFiles'>,
): CaseFile | undefined =>
  (theCase.caseFiles ?? []).find(isStoredVerdictAppealRulingPdf)

/** How the appeal ended, in the words the court chose it by. */
export const getVerdictAppealRulingDecisionLabel = (
  appealCase: Pick<AppealCase, 'appealRulingDecision'> | undefined | null,
): string | undefined => {
  const decision = appealCase?.appealRulingDecision

  return decision
    ? appealRulingDecisionOptions.find((option) => option.decision === decision)
        ?.label
    : undefined
}

/**
 * Whether the court can confirm the appeal as finished: it is still open,
 * the court has marked it "Lokið", and everything the backend asks of a
 * finished appeal is on record - the outcome, its type, the concluding words
 * and the document, stored as a PDF.
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
      getCompletableVerdictAppealRulingFile(theCase),
  )
}
