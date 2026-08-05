import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseTransition,
  IndictmentCaseState,
  IndictmentCaseTransition,
  IndictmentDecision,
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
import { Case, UpdateCase } from '../../repository'

type Actor = 'Prosecution' | 'Defence' | 'Neutral'

type Transition = (
  update: UpdateCase,
  theCase: Case,
  actor: Actor,
  nationalId?: string,
) => UpdateCase

interface IndictmentCaseRule {
  fromStates: IndictmentCaseState[]
  transition: Transition
}

interface RequestCaseRule {
  fromStates: RequestCaseState[]
  transition: Transition
}

const indictmentCaseStateMachine: Map<
  IndictmentCaseTransition,
  IndictmentCaseRule
> = new Map([
  [
    IndictmentCaseTransition.ASK_FOR_CONFIRMATION,
    {
      fromStates: [IndictmentCaseState.DRAFT, IndictmentCaseState.SUBMITTED],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        state: CaseState.WAITING_FOR_CONFIRMATION,
      }),
    },
  ],
  [
    IndictmentCaseTransition.DENY_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        state: CaseState.DRAFT,
      }),
    },
  ],
  [
    IndictmentCaseTransition.SUBMIT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        state: CaseState.SUBMITTED,
        indictmentDeniedExplanation: null,
      }),
    },
  ],
  [
    IndictmentCaseTransition.RECEIVE,
    {
      fromStates: [IndictmentCaseState.SUBMITTED],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        state: CaseState.RECEIVED,
      }),
    },
  ],
  [
    IndictmentCaseTransition.MOVE,
    {
      fromStates: [IndictmentCaseState.RECEIVED],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        courtCaseNumber: null,
        judgeId: null,
        registrarId: null,
        state: CaseState.SUBMITTED,
      }),
    },
  ],
  [
    IndictmentCaseTransition.ASK_FOR_CANCELLATION,
    {
      fromStates: [IndictmentCaseState.SUBMITTED, IndictmentCaseState.RECEIVED],
      transition: (update: UpdateCase, theCase: Case): UpdateCase => {
        if (update.indictmentDecision ?? theCase.indictmentDecision) {
          throw new ForbiddenException(
            'Cannot ask for cancellation of an indictment that is already in progress at the district court',
          )
        }

        return { ...update, state: CaseState.WAITING_FOR_CANCELLATION }
      },
    },
  ],
  [
    IndictmentCaseTransition.COMPLETE,
    {
      fromStates: [
        IndictmentCaseState.WAITING_FOR_CANCELLATION,
        IndictmentCaseState.RECEIVED,
        IndictmentCaseState.CORRECTING,
      ],
      transition: (update: UpdateCase, theCase: Case): UpdateCase => ({
        ...update,
        // Shouldn't ever happen since court end time should always be set
        // but just in case, we don't want rulingDate to be empty when completed.
        rulingDate: theCase.courtEndTime ?? nowFactory(),
        state: CaseState.COMPLETED,
      }),
    },
  ],
  [
    IndictmentCaseTransition.DELETE,
    {
      fromStates: [
        IndictmentCaseState.DRAFT,
        IndictmentCaseState.WAITING_FOR_CONFIRMATION,
      ],
      transition: (update: UpdateCase): UpdateCase => ({
        ...update,
        state: CaseState.DELETED,
      }),
    },
  ],
  [
    IndictmentCaseTransition.CORRECT,
    {
      fromStates: [IndictmentCaseState.COMPLETED],
      transition: (update: UpdateCase, theCase: Case): UpdateCase => {
        if (
          theCase.indictmentRulingDecision ===
          CaseIndictmentRulingDecision.WITHDRAWAL
        ) {
          throw new ForbiddenException(
            'Cannot correct a case that has been withdrawn',
          )
        }

        return {
          ...update,
          state: CaseState.CORRECTING,
          courtRecordHash: null,
        }
      },
    },
  ],
  [
    IndictmentCaseTransition.REOPEN,
    {
      fromStates: [IndictmentCaseState.COMPLETED],
      transition: (update: UpdateCase, theCase: Case): UpdateCase => {
        if (
          theCase.indictmentRulingDecision ===
          CaseIndictmentRulingDecision.WITHDRAWAL
        ) {
          throw new ForbiddenException(
            'Cannot reopen a case that has been withdrawn',
          )
        }

        if (theCase.mergeCaseId) {
          throw new ForbiddenException(
            'Cannot reopen a case that has been merged',
          )
        }

        if (
          theCase.appealCase &&
          (theCase.appealCase.appealState === AppealCaseState.APPEALED ||
            theCase.appealCase.appealState === AppealCaseState.RECEIVED)
        ) {
          throw new ForbiddenException(
            'Cannot reopen a case with an active appeal',
          )
        }

        return {
          ...update,
          state: CaseState.RECEIVED,
          indictmentDecision: IndictmentDecision.POSTPONING,
          postponedIndefinitelyExplanation: 'Mál enduropnað',
          indictmentReviewerId: null,
          courtRecordHash: null,
        }
      },
    },
  ],
])

const requestCaseCompletionSideEffect =
  (state: CaseState) => (update: UpdateCase, theCase: Case) => {
    const currentCourtEndTime =
      update.courtEndTime ?? theCase.courtEndTime ?? nowFactory()
    const newUpdate: UpdateCase = {
      ...update,
      state,
      rulingDate: currentCourtEndTime,
    }

    // Handle completed without ruling
    const isCompletedWithoutRuling =
      update.isCompletedWithoutRuling ?? theCase.isCompletedWithoutRuling
    if (isCompletedWithoutRuling) {
      newUpdate.rulingSignatureDate = null
    }

    return newUpdate
  }

const requestCaseStateMachine: Map<RequestCaseTransition, RequestCaseRule> =
  new Map([
    [
      RequestCaseTransition.OPEN,
      {
        fromStates: [RequestCaseState.NEW],
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          state: CaseState.DRAFT,
        }),
      },
    ],
    [
      RequestCaseTransition.SUBMIT,
      {
        fromStates: [RequestCaseState.DRAFT],
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          state: CaseState.SUBMITTED,
        }),
      },
    ],
    [
      RequestCaseTransition.RECEIVE,
      {
        fromStates: [RequestCaseState.SUBMITTED],
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          state: CaseState.RECEIVED,
        }),
      },
    ],
    [
      RequestCaseTransition.MOVE,
      {
        fromStates: [RequestCaseState.RECEIVED],
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          courtCaseNumber: null,
          judgeId: null,
          registrarId: null,
          state: CaseState.SUBMITTED,
        }),
      },
    ],
    [
      RequestCaseTransition.ACCEPT,
      {
        fromStates: [RequestCaseState.RECEIVED],
        transition: requestCaseCompletionSideEffect(CaseState.ACCEPTED),
      },
    ],
    [
      RequestCaseTransition.REJECT,
      {
        fromStates: [RequestCaseState.RECEIVED],
        transition: requestCaseCompletionSideEffect(CaseState.REJECTED),
      },
    ],
    [
      RequestCaseTransition.DISMISS,
      {
        fromStates: [RequestCaseState.RECEIVED],
        transition: requestCaseCompletionSideEffect(CaseState.DISMISSED),
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
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          state: CaseState.DELETED,
          parentCaseId: null,
        }),
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
        transition: (update: UpdateCase): UpdateCase => ({
          ...update,
          state: CaseState.RECEIVED,
          rulingDate: null,
          courtRecordSignatoryId: null,
          courtRecordSignatureDate: null,
        }),
      },
    ],
  ])

const transitionIndictmentCase = (
  transition: CaseTransition,
  theCase: Case,
  update: UpdateCase,
  actor: Actor,
  nationalId?: string,
): UpdateCase => {
  const currentState = update.state ?? theCase.state

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

  // Do not allow submitting indictment to court with 0 defendants
  if (
    (transition === IndictmentCaseTransition.ASK_FOR_CONFIRMATION ||
      transition === IndictmentCaseTransition.SUBMIT) &&
    (!theCase.defendants || theCase.defendants.length === 0)
  ) {
    throw new ForbiddenException(
      'Cannot submit indictment to court without at least one defendant',
    )
  }

  return rule.transition(update, theCase, actor, nationalId)
}

const transitionRequestCase = (
  transition: CaseTransition,
  theCase: Case,
  update: UpdateCase,
  actor: Actor,
): UpdateCase => {
  const currentState = update.state ?? theCase.state

  if (
    !isRequestCaseTransition(transition) ||
    !isRequestCaseState(currentState)
  ) {
    throw new ForbiddenException(
      `The transition ${transition} is not a valid transition for a request case in state ${currentState}`,
    )
  }

  const rule = requestCaseStateMachine.get(transition)

  if (!rule?.fromStates.some((state) => state === currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a request case in state ${currentState}`,
    )
  }

  return rule.transition(update, theCase, actor)
}

export const transitionCase = function (
  transition: CaseTransition,
  theCase: Case,
  user: User,
  update: UpdateCase = {},
): UpdateCase {
  let actor: Actor
  if (isProsecutionUser(user)) {
    actor = 'Prosecution'
  } else if (isDefenceUser(user)) {
    actor = 'Defence'
  } else {
    actor = 'Neutral'
  }

  if (isIndictmentCase(theCase.type)) {
    return transitionIndictmentCase(
      transition,
      theCase,
      update,
      actor,
      user.nationalId,
    )
  }

  if (isRequestCase(theCase.type)) {
    return transitionRequestCase(transition, theCase, update, actor)
  }

  throw new ForbiddenException(
    `The transition ${transition} cannot be applied to a ${theCase.type} case`,
  )
}
