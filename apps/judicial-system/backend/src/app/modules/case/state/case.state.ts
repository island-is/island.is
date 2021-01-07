import { ForbiddenException } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

interface Rule {
  from: CaseState[]
  to: CaseState
}

const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [
    CaseTransition.OPEN,
    {
      from: [CaseState.NEW],
      to: CaseState.DRAFT,
    },
  ],
  [
    CaseTransition.SUBMIT,
    {
      from: [CaseState.DRAFT],
      to: CaseState.SUBMITTED,
    },
  ],
  [
    CaseTransition.RECEIVE,
    {
      from: [CaseState.SUBMITTED],
      to: CaseState.RECEIVED,
    },
  ],
  [
    CaseTransition.ACCEPT,
    {
      from: [CaseState.RECEIVED],
      to: CaseState.ACCEPTED,
    },
  ],
  [
    CaseTransition.REJECT,
    {
      from: [CaseState.RECEIVED],
      to: CaseState.REJECTED,
    },
  ],
  [
    CaseTransition.DELETE,
    {
      from: [CaseState.NEW, CaseState.DRAFT],
      to: CaseState.DELETED,
    },
  ],
])

export const transitionCase = function (
  transition: CaseTransition,
  currentState: CaseState,
): CaseState {
  const rule: Rule = caseStateMachine.get(transition)

  if (!rule?.from.includes(currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState}`,
    )
  }

  return rule.to
}
