import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

interface CaseStates {
  state?: CaseState
  appealState?: CaseAppealState
}

interface Rule {
  fromStates: CaseState[]
  fromAppealStates: (undefined | CaseAppealState)[]
  to: CaseStates
}

export const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [
    CaseTransition.OPEN,
    {
      fromStates: [CaseState.NEW],
      fromAppealStates: [undefined],
      to: { state: CaseState.DRAFT },
    },
  ],
  [
    CaseTransition.SUBMIT,
    {
      fromStates: [CaseState.DRAFT],
      fromAppealStates: [undefined],
      to: { state: CaseState.SUBMITTED },
    },
  ],
  [
    CaseTransition.RECEIVE,
    {
      fromStates: [CaseState.SUBMITTED],
      fromAppealStates: [undefined],
      to: { state: CaseState.RECEIVED },
    },
  ],
  [
    CaseTransition.DELETE,
    {
      fromStates: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
      ],
      fromAppealStates: [undefined],
      to: { state: CaseState.DELETED },
    },
  ],
  [
    CaseTransition.ACCEPT,
    {
      fromStates: [CaseState.RECEIVED],
      fromAppealStates: [
        undefined,
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
      ],
      to: { state: CaseState.ACCEPTED },
    },
  ],
  [
    CaseTransition.REJECT,
    {
      fromStates: [CaseState.RECEIVED],
      fromAppealStates: [
        undefined,
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
      ],
      to: { state: CaseState.REJECTED },
    },
  ],
  [
    CaseTransition.DISMISS,
    {
      fromStates: [CaseState.RECEIVED],
      fromAppealStates: [
        undefined,
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
      ],
      to: { state: CaseState.DISMISSED },
    },
  ],
  [
    CaseTransition.REOPEN,
    {
      fromStates: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      fromAppealStates: [
        undefined,
        CaseAppealState.APPEALED,
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
      ],
      to: { state: CaseState.RECEIVED },
    },
  ],
  // APPEAL, RECEIVE_APPEAL and COMPLETE_APPEAL transitions do not affect the case state,
  // but they should be blocked if case is not in a state that allows for this transition to take place
  [
    CaseTransition.APPEAL,
    {
      fromStates: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      fromAppealStates: [undefined],
      to: { appealState: CaseAppealState.APPEALED },
    },
  ],
  [
    CaseTransition.RECEIVE_APPEAL,
    {
      fromStates: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      fromAppealStates: [CaseAppealState.APPEALED],
      to: { appealState: CaseAppealState.RECEIVED },
    },
  ],
  [
    CaseTransition.COMPLETE_APPEAL,
    {
      fromStates: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      fromAppealStates: [CaseAppealState.RECEIVED],
      to: { appealState: CaseAppealState.COMPLETED },
    },
  ],
  [
    CaseTransition.REOPEN_APPEAL,
    {
      fromStates: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED],
      fromAppealStates: [CaseAppealState.COMPLETED],
      to: { appealState: CaseAppealState.RECEIVED },
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
    !rule?.fromStates.some((state) => state === currentState) ||
    !rule?.fromAppealStates.some(
      (appealState) => appealState === (currentAppealState ?? undefined),
    )
  ) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState} and appeal state ${currentAppealState}`,
    )
  }

  const states: CaseStates = {}

  if (rule.to?.state) {
    states.state = rule.to.state
  }

  if (rule.to?.appealState) {
    states.appealState = rule.to.appealState
  }

  return states
}
