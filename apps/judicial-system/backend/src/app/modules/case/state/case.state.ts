import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

interface Rule {
  from: CaseStates[]
  to: CaseStates
}

interface CaseStates {
  state?: CaseState
  appealState?: CaseAppealState
}

export const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [
    CaseTransition.OPEN,
    {
      from: [{ state: CaseState.NEW }],
      to: { state: CaseState.DRAFT },
    },
  ],
  [
    CaseTransition.SUBMIT,
    {
      from: [{ state: CaseState.DRAFT }],
      to: { state: CaseState.SUBMITTED },
    },
  ],
  [
    CaseTransition.RECEIVE,
    {
      from: [{ state: CaseState.SUBMITTED }],
      to: { state: CaseState.RECEIVED },
    },
  ],
  [
    CaseTransition.ACCEPT,
    {
      from: [{ state: CaseState.RECEIVED }],
      to: { state: CaseState.ACCEPTED },
    },
  ],
  [
    CaseTransition.REJECT,
    {
      from: [{ state: CaseState.RECEIVED }],
      to: { state: CaseState.REJECTED },
    },
  ],
  [
    CaseTransition.DISMISS,
    {
      from: [{ state: CaseState.RECEIVED }],
      to: { state: CaseState.DISMISSED },
    },
  ],
  [
    CaseTransition.DELETE,
    {
      from: [
        { state: CaseState.NEW },
        { state: CaseState.DRAFT },
        { state: CaseState.SUBMITTED },
        { state: CaseState.RECEIVED },
      ],
      to: { state: CaseState.DELETED },
    },
  ],
  [
    CaseTransition.REOPEN,
    {
      from: [
        { state: CaseState.ACCEPTED },
        { state: CaseState.REJECTED },
        { state: CaseState.DISMISSED },
      ],
      to: { state: CaseState.RECEIVED },
    },
  ],
  // APPEAL, RECEIVE_APPEAL and COMPLETE_APPEAL transitions do not affect the case state,
  // but they should be blocked if case is not in a state that allows for this transition to take place
  [
    CaseTransition.APPEAL,
    {
      from: [{ state: CaseState.ACCEPTED }, { state: CaseState.REJECTED }],
      to: { appealState: CaseAppealState.APPEALED },
    },
  ],
  [
    CaseTransition.RECEIVE_APPEAL,
    {
      from: [
        {
          state: CaseState.ACCEPTED,
          appealState: CaseAppealState.APPEALED,
        },
        {
          state: CaseState.REJECTED,
          appealState: CaseAppealState.APPEALED,
        },
      ],
      to: { appealState: CaseAppealState.RECEIVED },
    },
  ],
  [
    CaseTransition.COMPLETE_APPEAL,
    {
      from: [
        {
          state: CaseState.ACCEPTED,
          appealState: CaseAppealState.RECEIVED,
        },
        {
          state: CaseState.REJECTED,
          appealState: CaseAppealState.RECEIVED,
        },
      ],
      to: { appealState: CaseAppealState.COMPLETED },
    },
  ],
])

export const transitionCase = function (
  transition: CaseTransition,
  currentState: CaseState,
  currentAppealState?: CaseAppealState,
): CaseStates {
  const rule = caseStateMachine.get(transition)

  if (
    !rule?.from.find((state) => {
      return (
        state.state === currentState &&
        state.appealState === (currentAppealState ?? undefined)
      )
    })
  ) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState} and appeal state ${currentAppealState}`,
    )
  }

  return {
    state: rule.to?.state,
    appealState: rule.to?.appealState,
  } as CaseStates
}
