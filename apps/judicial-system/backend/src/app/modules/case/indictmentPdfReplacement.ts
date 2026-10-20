import {
  isIndictmentCase,
  isIndictmentPdfReplaceableState,
  isProsecutionUser,
  type User,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'

// Cases whose prosecutor may replace the generated indictment with their own
// document. Empty unless a case has been granted it.
const indictmentPdfReplacementCaseIds: string[] = []

export const isIndictmentPdfReplacementCase = (
  caseId: string,
  allowedCaseIds = indictmentPdfReplacementCaseIds,
): boolean => allowedCaseIds.includes(caseId)

export const canReplaceIndictmentPdf = (
  theCase: Pick<Case, 'id' | 'type' | 'state' | 'splitCaseId'>,
  user: User,
  allowedCaseIds = indictmentPdfReplacementCaseIds,
): boolean =>
  isIndictmentPdfReplacementCase(theCase.id, allowedCaseIds) &&
  isIndictmentCase(theCase.type) &&
  // A split case shares its parent's indictment, which is replaced on the parent
  !theCase.splitCaseId &&
  isIndictmentPdfReplaceableState(theCase.state) &&
  isProsecutionUser(user)
