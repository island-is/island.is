import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseState,
  CaseTransition,
  IndictmentCaseState,
  IndictmentCaseTransition,
  isDefenceUser,
  isIndictmentCase,
  isIndictmentCaseState,
  isIndictmentCaseTransition,
  isProsecutionUser,
  isRequestCase,
  isRequestCaseState,
  isRequestCaseTransition,
  RequestCaseState,
  RequestCaseTransition,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { UpdateCase } from '../case.service'
import { Case } from '../models/case.model'

interface IndictmentCaseStates {
  state?: IndictmentCaseState
}

interface RequestCaseStates {
  state?: RequestCaseState
  appealState?: CaseAppealState
}

type SideEffect = (theCase: Case, user: User) => UpdateCase

interface IndictmentCaseRule {
  fromStates: IndictmentCaseState[]
  to: () => IndictmentCaseStates
  sideEffect?: SideEffect
}

interface RequestCaseRule {
  fromStates: RequestCaseState[]
  fromAppealStates: (undefined | CaseAppealState)[]
  to: () => RequestCaseStates
  sideEffect?: SideEffect
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
      to: () => ({ state: IndictmentCaseState.WAITING_FOR_CONFIRMATION }),
      sideEffect: () => ({ indictmentReturnedExplanation: null }),
    },
  ],
  [
    IndictmentCaseTransition.DENY_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      to: () => ({ state: IndictmentCaseState.DRAFT }),
    },
  ],
  [
    IndictmentCaseTransition.SUBMIT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      to: () => ({ state: IndictmentCaseState.SUBMITTED }),
      sideEffect: () => ({ indictmentDeniedExplanation: null }),
    },
  ],
  [
    IndictmentCaseTransition.ASK_FOR_CANCELLATION,
    {
      fromStates: [IndictmentCaseState.SUBMITTED, IndictmentCaseState.RECEIVED],
      to: () => ({ state: IndictmentCaseState.WAITING_FOR_CANCELLATION }),
      sideEffect: (theCase: Case) => {
        if (theCase.indictmentDecision) {
          throw new ForbiddenException(
            'Cannot ask for cancellation of an indictment that is already in progress at the district court',
          )
        }

        return {}
      },
    },
  ],
  [
    IndictmentCaseTransition.RECEIVE,
    {
      fromStates: [IndictmentCaseState.SUBMITTED],
      to: () => ({ state: IndictmentCaseState.RECEIVED }),
    },
  ],
  [
    IndictmentCaseTransition.RETURN_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.RECEIVED],
      to: () => ({ state: IndictmentCaseState.DRAFT }),
      sideEffect: () => ({ courtCaseNumber: null, indictmentHash: null }),
    },
  ],
  [
    IndictmentCaseTransition.COMPLETE,
    {
      fromStates: [
        IndictmentCaseState.WAITING_FOR_CANCELLATION,
        IndictmentCaseState.RECEIVED,
      ],
      to: () => ({ state: IndictmentCaseState.COMPLETED }),
      sideEffect: () => ({ rulingDate: nowFactory() }),
    },
  ],
  [
    IndictmentCaseTransition.DELETE,
    {
      fromStates: [
        IndictmentCaseState.DRAFT,
        IndictmentCaseState.WAITING_FOR_CONFIRMATION,
      ],
      to: () => ({ state: IndictmentCaseState.DELETED }),
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
        to: () => ({ state: RequestCaseState.DRAFT }),
      },
    ],
    [
      RequestCaseTransition.SUBMIT,
      {
        fromStates: [RequestCaseState.DRAFT],
        fromAppealStates: [undefined],
        to: () => ({ state: RequestCaseState.SUBMITTED }),
      },
    ],
    [
      RequestCaseTransition.RECEIVE,
      {
        fromStates: [RequestCaseState.SUBMITTED],
        fromAppealStates: [undefined],
        to: () => ({ state: RequestCaseState.RECEIVED }),
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
        to: () => ({ state: RequestCaseState.ACCEPTED }),
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
        to: () => ({ state: RequestCaseState.REJECTED }),
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
        to: () => ({ state: RequestCaseState.DISMISSED }),
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
        to: () => ({ state: RequestCaseState.DELETED }),
        sideEffect: () => ({ parentCaseId: null }),
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
        to: () => ({ state: RequestCaseState.RECEIVED }),
        sideEffect: () => ({
          rulingDate: null,
          courtRecordSignatoryId: null,
          courtRecordSignatureDate: null,
        }),
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
        to: () => ({ appealState: CaseAppealState.APPEALED }),
        sideEffect: (theCase: Case, user: User) => {
          if (isProsecutionUser(user)) {
            return { prosecutorPostponedAppealDate: nowFactory() }
          }
          if (isDefenceUser(user)) {
            return { accusedPostponedAppealDate: nowFactory() }
          }

          throw new ForbiddenException(
            `A ${user.role} user cannot appeal a ${theCase.type} case`,
          )
        },
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
        to: () => ({ appealState: CaseAppealState.RECEIVED }),
        sideEffect: () => ({ appealReceivedByCourtDate: nowFactory() }),
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
        to: () => ({ appealState: CaseAppealState.COMPLETED }),
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
        to: () => ({ appealState: CaseAppealState.RECEIVED }),
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
        to: () => ({ appealState: CaseAppealState.WITHDRAWN }),
        sideEffect: (theCase: Case) => {
          // We only want to set the appeal ruling decision if the
          // case has already been received.
          // Otherwise the court of appeals never knew of the appeal in
          // the first place so it remains withdrawn without a decision.
          if (
            !theCase.appealRulingDecision &&
            theCase.appealState === CaseAppealState.RECEIVED
          ) {
            return {
              appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
            }
          }

          return {}
        },
      },
    ],
  ])

const transitionIndictmentCase = (
  transition: CaseTransition,
  theCase: Case,
  user: User,
  currentState: CaseState,
): UpdateCase => {
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

  const states = rule.to() as UpdateCase

  const sideEffect = rule.sideEffect?.(theCase, user) ?? {}

  return { ...states, ...sideEffect }
}

const transitionRequestCase = (
  transition: CaseTransition,
  theCase: Case,
  user: User,
  currentState: CaseState,
  currentAppealState?: CaseAppealState | undefined,
): UpdateCase => {
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

  const states = rule.to() as UpdateCase

  const sideEffect = rule.sideEffect?.(theCase, user) ?? {}

  return { ...states, ...sideEffect }
}

export const transitionCase = function (
  transition: CaseTransition,
  theCase: Case,
  user: User,
  currentState?: CaseState,
  currentAppealState?: CaseAppealState,
): CaseStates {
  if (isIndictmentCase(theCase.type)) {
    return transitionIndictmentCase(
      transition,
      theCase,
      user,
      currentState ?? theCase.state,
    )
  }

  if (isRequestCase(theCase.type)) {
    return transitionRequestCase(
      transition,
      theCase,
      user,
      currentState ?? theCase.state,
      currentAppealState ?? theCase.appealState,
    )
  }

  throw new ForbiddenException(
    `The transition ${transition} cannot be applied to a ${theCase.type} case`,
  )
}
