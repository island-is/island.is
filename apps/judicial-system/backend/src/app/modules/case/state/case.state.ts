import { ForbiddenException } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

interface Rule {
  from: CaseState[]
  to: CaseState | undefined
}

export const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [CaseTransition.OPEN, { from: [CaseState.NEW], to: CaseState.DRAFT }],
  [CaseTransition.SUBMIT, { from: [CaseState.DRAFT], to: CaseState.SUBMITTED }],
  [
    CaseTransition.RECEIVE,
    { from: [CaseState.SUBMITTED], to: CaseState.RECEIVED },
  ],
  [
    CaseTransition.ACCEPT,
    { from: [CaseState.RECEIVED], to: CaseState.ACCEPTED },
  ],
  [
    CaseTransition.REJECT,
    { from: [CaseState.RECEIVED], to: CaseState.REJECTED },
  ],
  [
    CaseTransition.DISMISS,
    { from: [CaseState.RECEIVED], to: CaseState.DISMISSED },
  ],
  [
    CaseTransition.DELETE,
    {
      from: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
      ],
      to: CaseState.DELETED,
    },
  ],
  [
    CaseTransition.REOPEN,
    {
      from: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      to: CaseState.RECEIVED,
    },
  ],
  // APPEAL, RECEIVE_APPEAL and COMPLETE_APPEAL transitions do not affect the case state,
  // but they should be blocked if case is not in a state that allows for this transition to take place
  [
    CaseTransition.APPEAL,
    {
      from: [CaseState.ACCEPTED, CaseState.REJECTED],
      to: undefined,
    },
  ],
  [
    CaseTransition.RECEIVE_APPEAL,
    {
      from: [CaseState.ACCEPTED, CaseState.REJECTED],
      to: undefined,
    },
  ],
  [
    CaseTransition.COMPLETE_APPEAL,
    {
      from: [CaseState.ACCEPTED, CaseState.REJECTED],
      to: undefined,
    },
  ],
])

export const transitionCase = function (
  transition: CaseTransition,
  currentState: CaseState,
): CaseState {
  const rule = caseStateMachine.get(transition)

  if (!rule?.from.includes(currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState}`,
    )
  }

  return rule.to ?? currentState
}
