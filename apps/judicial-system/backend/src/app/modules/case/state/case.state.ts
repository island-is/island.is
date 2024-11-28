import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseFileCategory,
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
  isRestrictionCase,
  RequestCaseState,
  RequestCaseTransition,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { UpdateCase } from '../case.service'
import { Case } from '../models/case.model'

type Actor = 'Prosecution' | 'Defence' | 'Neutral'

type Transition = (
  update: UpdateCase,
  theCase: Case,
  actor: Actor,
) => UpdateCase

interface IndictmentCaseRule {
  fromStates: IndictmentCaseState[]
  transition: Transition
}

interface RequestCaseRule {
  fromStates: RequestCaseState[]
  fromAppealStates: (CaseAppealState | undefined)[]
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
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.WAITING_FOR_CONFIRMATION,
        indictmentReturnedExplanation: null,
      }),
    },
  ],
  [
    IndictmentCaseTransition.DENY_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.DRAFT,
      }),
    },
  ],
  [
    IndictmentCaseTransition.SUBMIT,
    {
      fromStates: [IndictmentCaseState.WAITING_FOR_CONFIRMATION],
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.SUBMITTED,
        indictmentDeniedExplanation: null,
      }),
    },
  ],
  [
    IndictmentCaseTransition.ASK_FOR_CANCELLATION,
    {
      fromStates: [IndictmentCaseState.SUBMITTED, IndictmentCaseState.RECEIVED],
      transition: (update: UpdateCase, theCase: Case) => {
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
    IndictmentCaseTransition.RECEIVE,
    {
      fromStates: [IndictmentCaseState.SUBMITTED],
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.RECEIVED,
      }),
    },
  ],
  [
    IndictmentCaseTransition.RETURN_INDICTMENT,
    {
      fromStates: [IndictmentCaseState.RECEIVED],
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.DRAFT,
        courtCaseNumber: null,
        indictmentHash: null,
      }),
    },
  ],
  [
    IndictmentCaseTransition.COMPLETE,
    {
      fromStates: [
        IndictmentCaseState.WAITING_FOR_CANCELLATION,
        IndictmentCaseState.RECEIVED,
      ],
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.COMPLETED,
        rulingDate: nowFactory(),
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
      transition: (update: UpdateCase) => ({
        ...update,
        state: CaseState.DELETED,
      }),
    },
  ],
])

const handleAppealInCourt = (update: UpdateCase, theCase: Case) => {
  // Note that this method attempts to handle case correction (reopen + complete)

  const currentCourtEndTime = update.courtEndTime ?? theCase.courtEndTime
  const currentProsecutorAppealDecision =
    update.prosecutorAppealDecision ?? theCase.prosecutorAppealDecision
  const currentAccusedAppealDecision =
    update.accusedAppealDecision ?? theCase.accusedAppealDecision
  const currentAppealState =
    update.appealState === undefined ? theCase.appealState : update.appealState
  // We want to preserve an already set appeal date, even if it is null
  const currentProsecutorPostponedAppealDate =
    update.prosecutorPostponedAppealDate === undefined
      ? theCase.prosecutorPostponedAppealDate
      : update.prosecutorPostponedAppealDate
  // We want to preserve an already set appeal date, even if it is null
  const currentAccusedPostponedAppealDate =
    update.accusedPostponedAppealDate === undefined
      ? theCase.accusedPostponedAppealDate
      : update.accusedPostponedAppealDate

  const newUpdate = { ...update }

  if (currentProsecutorAppealDecision === CaseAppealDecision.ACCEPT) {
    // The prosecutor accepted in court
    // The prosecutor appeal date should be null
    newUpdate.prosecutorPostponedAppealDate = null
  }

  if (currentAccusedAppealDecision === CaseAppealDecision.ACCEPT) {
    // The accused accepted in court
    // The accused appeal date should be null
    newUpdate.accusedPostponedAppealDate = null
  }

  if (
    currentProsecutorAppealDecision === CaseAppealDecision.ACCEPT &&
    currentAccusedAppealDecision === CaseAppealDecision.ACCEPT
  ) {
    // Both parties accepted in court
    // The appeal state should be null
    // Note that if the case was appealed out of court, we do not clean up the uploaded appeal documents
    return { ...newUpdate, appealState: null }
  }

  const hasBeenAppealedPreviously = Boolean(currentAppealState)

  if (currentProsecutorAppealDecision === CaseAppealDecision.APPEAL) {
    // The prosecutor appealed in court
    // The accused appeal date should be null
    // The prosecutor appeal date should be set
    newUpdate.prosecutorPostponedAppealDate = currentCourtEndTime
    newUpdate.accusedPostponedAppealDate = null
  } else if (currentAccusedAppealDecision === CaseAppealDecision.APPEAL) {
    // The prosecutor did not appeal in court, but the accused did
    // The prosecutor appeal date should be null
    // The accused appeal date should be set
    newUpdate.prosecutorPostponedAppealDate = null
    newUpdate.accusedPostponedAppealDate = currentCourtEndTime
  } else {
    // Neither party appealed in court

    const hasValidAppeal =
      hasBeenAppealedPreviously &&
      ((currentProsecutorAppealDecision !== CaseAppealDecision.ACCEPT &&
        Boolean(currentProsecutorPostponedAppealDate) &&
        theCase.caseFiles?.some(
          (caseFile) =>
            caseFile.category === CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        )) ||
        (currentAccusedAppealDecision !== CaseAppealDecision.ACCEPT &&
          Boolean(currentAccusedPostponedAppealDate) &&
          theCase.caseFiles?.some(
            (caseFile) =>
              caseFile.category === CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
          )))

    if (hasValidAppeal) {
      // The case has a valid appeal
      return newUpdate
    }

    // The case does not have a valid appeal

    return {
      ...newUpdate,
      appealState: null,
      prosecutorPostponedAppealDate: null,
      accusedPostponedAppealDate: null,
    }

    return newUpdate
  }

  // Either the prosecutor or the accused appealed in court

  if (hasBeenAppealedPreviously) {
    // The case has already been appealed and we leave the appeal state as is
    // Note that if the case was appealed out of court, we do not clean up the uploaded appeal documents
    return newUpdate
  }

  // The case has not been appealed yet
  return transitionRequestCase(
    CaseTransition.APPEAL,
    theCase,
    update,
    currentProsecutorAppealDecision === CaseAppealDecision.APPEAL
      ? 'Prosecution'
      : 'Defence',
  )
}

const requestCaseCompletionSideEffect =
  (state: CaseState) => (update: UpdateCase, theCase: Case) => {
    return handleAppealInCourt(
      {
        ...update,
        state,
        rulingDate: update.courtEndTime ?? theCase.courtEndTime,
      },
      theCase,
    )
  }

const requestCaseStateMachine: Map<RequestCaseTransition, RequestCaseRule> =
  new Map([
    [
      RequestCaseTransition.OPEN,
      {
        fromStates: [RequestCaseState.NEW],
        fromAppealStates: [undefined],
        transition: (update: UpdateCase) => ({
          ...update,
          state: CaseState.DRAFT,
        }),
      },
    ],
    [
      RequestCaseTransition.SUBMIT,
      {
        fromStates: [RequestCaseState.DRAFT],
        fromAppealStates: [undefined],
        transition: (update: UpdateCase) => ({
          ...update,
          state: CaseState.SUBMITTED,
        }),
      },
    ],
    [
      RequestCaseTransition.RECEIVE,
      {
        fromStates: [RequestCaseState.SUBMITTED],
        fromAppealStates: [undefined],
        transition: (update: UpdateCase) => ({
          ...update,
          state: CaseState.RECEIVED,
        }),
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
        transition: requestCaseCompletionSideEffect(CaseState.ACCEPTED),
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
        transition: requestCaseCompletionSideEffect(CaseState.REJECTED),
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
        fromAppealStates: [undefined],
        transition: (update: UpdateCase) => ({
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
        fromAppealStates: [
          undefined,
          CaseAppealState.APPEALED,
          CaseAppealState.RECEIVED,
          CaseAppealState.COMPLETED,
          CaseAppealState.WITHDRAWN,
        ],
        transition: (update: UpdateCase) => ({
          ...update,
          state: CaseState.RECEIVED,
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
        transition: (update: UpdateCase, theCase: Case, actor?: Actor) => {
          if (actor === 'Prosecution') {
            return {
              ...update,
              appealState: CaseAppealState.APPEALED,
              // We don't want to overwrite an already set appeal date, unless it is null
              prosecutorPostponedAppealDate:
                update.prosecutorPostponedAppealDate ?? nowFactory(),
            }
          }

          if (actor === 'Defence') {
            return {
              ...update,
              appealState: CaseAppealState.APPEALED,
              // We don't want to overwrite an already set appeal date, unless it is null
              accusedPostponedAppealDate:
                update.accusedPostponedAppealDate ?? nowFactory(),
            }
          }

          throw new ForbiddenException(
            `${actor} cannot appeal a ${theCase.type} case`,
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
        transition: (update: UpdateCase) => ({
          ...update,
          appealState: CaseAppealState.RECEIVED,
          appealReceivedByCourtDate: nowFactory(),
        }),
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
        transition: (update: UpdateCase, theCase: Case) => {
          const newUpdate = {
            ...update,
            appealState: CaseAppealState.COMPLETED,
          }

          const currentState = update.state ?? theCase.state
          const currentDecision = update.decision ?? theCase.decision

          if (
            isRestrictionCase(theCase.type) &&
            currentState === CaseState.ACCEPTED &&
            (currentDecision === CaseDecision.ACCEPTING ||
              currentDecision === CaseDecision.ACCEPTING_PARTIALLY)
          ) {
            // TODO: Decide what to do with ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            // TODO: Decide what to do if correcting appeal
            const currentAppealRulingDecision =
              update.appealRulingDecision ?? theCase.appealRulingDecision

            if (
              currentAppealRulingDecision ===
                CaseAppealRulingDecision.CHANGED ||
              currentAppealRulingDecision ===
                CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY
            ) {
              // The court of appeals has modified the ruling of a restriction case
              newUpdate.validToDate =
                update.appealValidToDate ?? theCase.appealValidToDate
              newUpdate.isCustodyIsolation =
                update.isAppealCustodyIsolation ??
                theCase.isAppealCustodyIsolation
              newUpdate.isolationToDate =
                update.appealIsolationToDate ?? theCase.appealIsolationToDate
            } else if (
              currentAppealRulingDecision === CaseAppealRulingDecision.REPEAL
            ) {
              // The court of appeals has repealed the ruling of a restriction case
              newUpdate.validToDate = nowFactory()
            }
          }

          return newUpdate
        },
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
        transition: (update: UpdateCase) => ({
          ...update,
          appealState: CaseAppealState.RECEIVED,
        }),
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
        transition: (update: UpdateCase, theCase: Case) => {
          // We only want to set the appeal ruling decision if the
          // case has already been received.
          // Otherwise the court of appeals never knew of the appeal in
          // the first place so it remains withdrawn without a decision.
          if (
            !(update.appealRulingDecision ?? theCase.appealRulingDecision) &&
            (update.appealState ?? theCase.appealState) ===
              CaseAppealState.RECEIVED
          ) {
            return {
              ...update,
              appealState: CaseAppealState.WITHDRAWN,
              appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
            }
          }

          return { ...update, appealState: CaseAppealState.WITHDRAWN }
        },
      },
    ],
  ])

const transitionIndictmentCase = (
  transition: CaseTransition,
  theCase: Case,
  update: UpdateCase,
  actor: Actor,
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

  return rule.transition(update, theCase, actor)
}

const transitionRequestCase = (
  transition: CaseTransition,
  theCase: Case,
  update: UpdateCase,
  actor: Actor,
): UpdateCase => {
  const currentState = update.state ?? theCase.state
  const currentAppealState = update.appealState ?? theCase.appealState

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
    return transitionIndictmentCase(transition, theCase, update, actor)
  }

  if (isRequestCase(theCase.type)) {
    return transitionRequestCase(transition, theCase, update, actor)
  }

  throw new ForbiddenException(
    `The transition ${transition} cannot be applied to a ${theCase.type} case`,
  )
}
