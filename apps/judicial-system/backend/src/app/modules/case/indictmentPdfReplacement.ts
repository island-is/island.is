import {
  isIndictmentCase,
  isIndictmentPdfReplaceableState,
  isProsecutionUser,
  type User,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'

export const canReplaceIndictmentPdf = (
  theCase: Pick<
    Case,
    'id' | 'type' | 'state' | 'splitCaseId' | 'indictmentHash'
  >,
  user: User,
): boolean =>
  isIndictmentCase(theCase.type) &&
  // A split case shares its parent's indictment, which is replaced on the parent
  !theCase.splitCaseId &&
  isIndictmentPdfReplaceableState(theCase.state) &&
  // The generated indictment must already be frozen to S3 (hash set) before
  // it can be replaced, so a concurrent getIndictmentPdf cannot regenerate
  // over the upload.
  Boolean(theCase.indictmentHash) &&
  isProsecutionUser(user)
