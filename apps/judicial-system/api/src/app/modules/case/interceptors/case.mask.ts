import { isInvestigationCase } from '@island.is/judicial-system/types'

import { Case } from '../models'

export function maskCase(theCase: Case): Case {
  if (isInvestigationCase(theCase.type)) {
    theCase.accusedNationalId = '0000000000'
    theCase.accusedName = 'X'
  }

  return theCase
}
