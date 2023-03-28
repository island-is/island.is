import { ForbiddenException } from '@nestjs/common'

import {
  CaseState,
  CaseTransition,
  CaseAppealState,
} from '@island.is/judicial-system/types'
import { caseStateMachine } from './case.state'

interface Rule {
  from: CaseAppealState[] | undefined
  to: CaseAppealState
}

const appealCaseStateMachine: Map<CaseTransition, Rule> = new Map([
  [CaseTransition.APPEAL, { from: undefined, to: CaseAppealState.APPEALED }],
  [
    CaseTransition.RECEIVE_APPEAL,
    { from: [CaseAppealState.APPEALED], to: CaseAppealState.RECEIVED },
  ],
  [
    CaseTransition.COMPLETE_APPEAL,
    { from: [CaseAppealState.RECEIVED], to: CaseAppealState.COMPLETED },
  ],
])

export const transitionAppealCase = function (
  transition: CaseTransition,
  caseState: CaseState,
  currentAppealState?: CaseAppealState,
): CaseAppealState | undefined {
  const appealRule = appealCaseStateMachine.get(transition)
  const caseRule = caseStateMachine.get(transition)

  // There are only a few transitions that can be applied to a case in appeal state
  // The rest are handled in case.state as they affect the case state
  if (!appealRule) {
    return undefined
  }

  if (
    (currentAppealState && !appealRule.from?.includes(currentAppealState)) ||
    (!currentAppealState && appealRule.from !== undefined) ||
    !caseRule?.from.includes(caseState) // Case state rules are defined in case.state
  ) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in appeal state ${currentAppealState} and case state ${caseState}`,
    )
  }

  return appealRule?.to
}
