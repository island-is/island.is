import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
  CaseType,
  IndictmentCaseState,
  IndictmentCaseTransition,
  isIndictmentCase,
  isIndictmentCaseState,
  isIndictmentCaseTransition,
  isRequestCase,
  isRequestCaseState,
  isRequestCaseTransition,
  RequestCaseState,
  RequestCaseTransition,
} from '@island.is/judicial-system/types'

interface IndictmentCaseStates {
  state?: IndictmentCaseState
}

interface RequestCaseStates {
  state?: RequestCaseState
  appealState?: CaseAppealState
}

interface IndictmentCaseRule {
  fromStates: IndictmentCaseState[]
  to: IndictmentCaseStates
}

interface RequestCaseRule {
  fromStates: RequestCaseState[]
  fromAppealStates: (undefined | CaseAppealState)[]
  to: RequestCaseStates
}

interface CaseStates {
  state?: CaseState
  appealState?: CaseAppealState
}

const indictmentCaseStateMachine: Map<
  IndictmentCaseTransition,
  IndictmentCaseRule
> = new Map([
  [
    IndictmentCaseTransition.ASK_FOR_CONFIRMATION,
    {
      fromStates: [IndictmentCaseState.DRAFT, IndictmentCaseState.SUBMITTED],
      to: { state: IndictmentCaseState.WAITING_FOR_CONFIRMATION },
    },
  ],
  [
    IndictmentCaseTransition.DENY_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      to: { state: IndictmentCaseState.DRAFT },
    },
  ],
  [
    IndictmentCaseTransition.SUBMIT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      to: { state: IndictmentCaseState.SUBMITTED },
    },
  ],
  [
    IndictmentCaseTransition.ASK_FOR_CANCELLATION,
    {
      fromStates: [IndictmentCaseState.SUBMITTED, IndictmentCaseState.RECEIVED],
      to: { state: IndictmentCaseState.WAITING_FOR_CANCELLATION },
    },
  ],
  [
    IndictmentCaseTransition.RECEIVE,
    {
      fromStates: [IndictmentCaseState.SUBMITTED],
      to: { state: IndictmentCaseState.RECEIVED },
    },
  ],
  [
    IndictmentCaseTransition.RETURN_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.RECEIVED],
      to: { state: IndictmentCaseState.DRAFT },
    },
  ],
  [
    IndictmentCaseTransition.COMPLETE,
    {
      fromStates: [
        IndictmentCaseState.WAITING_FOR_CANCELLATION,
        IndictmentCaseState.RECEIVED,
      ],
      to: { state: IndictmentCaseState.COMPLETED },
    },
  ],
  [
    IndictmentCaseTransition.DELETE,
    {
      fromStates: [
        IndictmentCaseState.DRAFT,
        IndictmentCaseState.WAITING_FOR_CONFIRMATION,
      ],
      to: { state: IndictmentCaseState.DELETED },
    },
  ],
])

const requestCaseStateMachine: Map<RequestCaseTransition, RequestCaseRule> =
  new Map([
    [
      RequestCaseTransition.OPEN,
      {
        fromStates: [RequestCaseState.NEW],
        fromAppealStates: [undefined],
        to: { state: RequestCaseState.DRAFT },
      },
    ],
    [
      RequestCaseTransition.SUBMIT,
      {
        fromStates: [RequestCaseState.DRAFT],
        fromAppealStates: [undefined],
        to: { state: RequestCaseState.SUBMITTED },
      },
    ],
    [
      RequestCaseTransition.RECEIVE,
      {
        fromStates: [RequestCaseState.SUBMITTED],
        fromAppealStates: [undefined],
        to: { state: RequestCaseState.RECEIVED },
      },
    ],
    [
      RequestCaseTransition.ACCEPT,
      {
        fromStates: [RequestCaseState.RECEIVED],
        fromAppealStates: [
          undefined,
          CaseAppealState.APPEALED,
          CaseAppealState.RECEIVED,
          CaseAppealState.COMPLETED,
          CaseAppealState.WITHDRAWN,
        ],
        to: { state: RequestCaseState.ACCEPTED },
      },
    ],
    [
      RequestCaseTransition.REJECT,
      {
        fromStates: [RequestCaseState.RECEIVED],
        fromAppealStates: [
          undefined,
          CaseAppealState.APPEALED,
          CaseAppealState.RECEIVED,
          CaseAppealState.COMPLETED,
          CaseAppealState.WITHDRAWN,
        ],
        to: { state: RequestCaseState.REJECTED },
      },
    ],
    [
      RequestCaseTransition.DISMISS,
      {
        fromStates: [RequestCaseState.RECEIVED],
        fromAppealStates: [
          undefined,
          CaseAppealState.APPEALED,
          CaseAppealState.RECEIVED,
          CaseAppealState.COMPLETED,
          CaseAppealState.WITHDRAWN,
        ],
        to: { state: RequestCaseState.DISMISSED },
      },
    ],
    [
      RequestCaseTransition.DELETE,
      {
        fromStates: [
          RequestCaseState.NEW,
          RequestCaseState.DRAFT,
          RequestCaseState.SUBMITTED,
          RequestCaseState.RECEIVED,
        ],
        fromAppealStates: [undefined],
        to: { state: RequestCaseState.DELETED },
      },
    ],
    [
      RequestCaseTransition.REOPEN,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [
          undefined,
          CaseAppealState.APPEALED,
          CaseAppealState.RECEIVED,
          CaseAppealState.COMPLETED,
          CaseAppealState.WITHDRAWN,
        ],
        to: { state: RequestCaseState.RECEIVED },
      },
    ],
    // APPEAL, RECEIVE_APPEAL and COMPLETE_APPEAL transitions do not affect the case state,
    // but they should be blocked if the case is not in a state that allows for this transition to take place
    [
      RequestCaseTransition.APPEAL,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [undefined],
        to: { appealState: CaseAppealState.APPEALED },
      },
    ],
    [
      RequestCaseTransition.RECEIVE_APPEAL,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [CaseAppealState.APPEALED],
        to: { appealState: CaseAppealState.RECEIVED },
      },
    ],
    [
      RequestCaseTransition.COMPLETE_APPEAL,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [CaseAppealState.RECEIVED, CaseAppealState.WITHDRAWN],
        to: { appealState: CaseAppealState.COMPLETED },
      },
    ],
    [
      RequestCaseTransition.REOPEN_APPEAL,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [CaseAppealState.COMPLETED],
        to: { appealState: CaseAppealState.RECEIVED },
      },
    ],
    [
      RequestCaseTransition.WITHDRAW_APPEAL,
      {
        fromStates: [
          RequestCaseState.ACCEPTED,
          RequestCaseState.REJECTED,
          RequestCaseState.DISMISSED,
        ],
        fromAppealStates: [CaseAppealState.APPEALED, CaseAppealState.RECEIVED],
        to: { appealState: CaseAppealState.WITHDRAWN },
      },
    ],
  ])

const transitionIndictmentCase = (
  transition: CaseTransition,
  currentState: CaseState,
): CaseStates => {
  if (
    !isIndictmentCaseTransition(transition) ||
    !isIndictmentCaseState(currentState)
  ) {
    throw new ForbiddenException(
      `The transition ${transition} is not a valid transition for an indictment case in state ${currentState}`,
    )
  }

  const rule = indictmentCaseStateMachine.get(transition)

  if (!rule?.fromStates.some((state) => state === currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to an indictment case in state ${currentState}`,
    )
  }

  return rule.to as CaseStates
}

const transitionRequestCase = (
  transition: CaseTransition,
  currentState: CaseState,
  currentAppealState?: CaseAppealState | undefined,
): CaseStates => {
  if (
    !isRequestCaseTransition(transition) ||
    !isRequestCaseState(currentState)
  ) {
    throw new ForbiddenException(
      `The transition ${transition} is not a valid transition for a request case in state ${currentState}`,
    )
  }

  const rule = requestCaseStateMachine.get(transition)

  if (
    !rule?.fromStates.some((state) => state === currentState) ||
    !rule?.fromAppealStates.some(
      (appealState) => appealState === (currentAppealState ?? undefined),
    )
  ) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a request case in state ${currentState} and appeal state ${currentAppealState}`,
    )
  }

  return rule.to as CaseStates
}

export const transitionCase = function (
  transition: CaseTransition,
  caseType: CaseType,
  currentState: CaseState,
  currentAppealState?: CaseAppealState,
): CaseStates {
  if (isIndictmentCase(caseType)) {
    return transitionIndictmentCase(transition, currentState)
  }

  if (isRequestCase(caseType)) {
    return transitionRequestCase(transition, currentState, currentAppealState)
  }

  throw new ForbiddenException(
    `The transition ${transition} cannot be applied to a ${caseType} case`,
  )
}
