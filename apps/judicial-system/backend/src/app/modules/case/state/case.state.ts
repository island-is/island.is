import { ForbiddenException } from '@nestjs/common'

import { CaseState, xCaseTransition } from '@island.is/judicial-system/types'

interface Rule {
  from: CaseState[]
  to: CaseState
}

const caseStateMachine: Map<xCaseTransition, Rule> = new Map([
  [
    xCaseTransition.OPEN,
    {
      from: [CaseState.New],
      to: CaseState.Draft,
    },
  ],
  [
    xCaseTransition.SUBMIT,
    {
      from: [CaseState.Draft],
      to: CaseState.Submitted,
    },
  ],
  [
    xCaseTransition.RECEIVE,
    {
      from: [CaseState.Submitted],
      to: CaseState.Received,
    },
  ],
  [
    xCaseTransition.DISMISS,
    {
      from: [CaseState.Received],
      to: CaseState.Dismissed,
    },
  ],
  [
    xCaseTransition.ACCEPT,
    {
      from: [CaseState.Received],
      to: CaseState.Accepted,
    },
  ],
  [
    xCaseTransition.REJECT,
    {
      from: [CaseState.Received],
      to: CaseState.Rejected,
    },
  ],
  [
    xCaseTransition.DELETE,
    {
      from: [
        CaseState.New,
        CaseState.Draft,
        CaseState.Submitted,
        CaseState.Received,
      ],
      to: CaseState.Deleted,
    },
  ],
])

export const transitionCase = function (
  transition: xCaseTransition,
  currentState: CaseState,
): CaseState {
  const rule = caseStateMachine.get(transition)

  if (!rule?.from.includes(currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState}`,
    )
  }

  return rule.to
}
