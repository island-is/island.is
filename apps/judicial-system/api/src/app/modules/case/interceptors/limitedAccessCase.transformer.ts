import { canDefenderViewRequest } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

export function transformLimitedAccessCase(theCase: Case): Case {
  return {
    ...theCase,
    caseResentExplanation: canDefenderViewRequest(theCase)
      ? theCase.caseResentExplanation
      : undefined,
  }
}
