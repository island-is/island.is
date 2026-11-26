import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  CaseDecision,
  CaseState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import {
  AppealCase,
  Case,
  UpdateAppealCase,
  UpdateCase,
} from '../../repository'

export interface AppealTransitionResult {
  caseUpdate: UpdateCase
  appealCaseUpdate: UpdateAppealCase
}

type AppealTransition = (
  theCase: Case,
  appealCase: AppealCase,
) => AppealTransitionResult

// A verdict appeal takes its own route: it is never received nor reopened.
// The court of appeals confirms how it ended from the state it is filed in
// (APPEALED -> READY_TO_COMPLETE), and it is completed when the outcome is
// released (READY_TO_COMPLETE -> COMPLETED). Each rule therefore names the
// states it applies from for a verdict appeal separately; an empty list refuses
// the transition for that kind of appeal altogether.
interface AppealCaseRule {
  fromAppealStates: AppealCaseState[]
  fromVerdictAppealStates: AppealCaseState[]
  transition: AppealTransition
}

const appealCaseStateMachine: Map<AppealCaseTransition, AppealCaseRule> =
  new Map([
    [
      AppealCaseTransition.RECEIVE_APPEAL,
      {
        fromAppealStates: [AppealCaseState.APPEALED],
        fromVerdictAppealStates: [],
        transition: (): AppealTransitionResult => ({
          caseUpdate: {},
          appealCaseUpdate: {
            appealState: AppealCaseState.RECEIVED,
            appealReceivedByCourtDate: nowFactory(),
          },
        }),
      },
    ],
    [
      AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
      {
        fromAppealStates: [],
        fromVerdictAppealStates: [AppealCaseState.APPEALED],
        // The date the court entered for the appeal's end is kept.
        transition: (): AppealTransitionResult => ({
          caseUpdate: {},
          appealCaseUpdate: { appealState: AppealCaseState.READY_TO_COMPLETE },
        }),
      },
    ],
    [
      AppealCaseTransition.COMPLETE_APPEAL,
      {
        fromAppealStates: [AppealCaseState.RECEIVED, AppealCaseState.WITHDRAWN],
        fromVerdictAppealStates: [AppealCaseState.READY_TO_COMPLETE],
        transition: (
          theCase: Case,
          appealCase: AppealCase,
        ): AppealTransitionResult => {
          const caseUpdate: UpdateCase = {}
          const currentDecision = theCase.decision

          if (
            isRestrictionCase(theCase.type) &&
            theCase.state === CaseState.ACCEPTED &&
            (currentDecision === CaseDecision.ACCEPTING ||
              currentDecision === CaseDecision.ACCEPTING_PARTIALLY)
          ) {
            const currentAppealRulingDecision = appealCase.appealRulingDecision

            if (
              currentAppealRulingDecision ===
                AppealCaseRulingDecision.CHANGED ||
              currentAppealRulingDecision ===
                AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY
            ) {
              caseUpdate.validToDate = appealCase.appealValidToDate
              caseUpdate.isCustodyIsolation =
                appealCase.isAppealCustodyIsolation
              caseUpdate.isolationToDate = appealCase.appealIsolationToDate
            } else if (
              currentAppealRulingDecision === AppealCaseRulingDecision.REPEAL
            ) {
              caseUpdate.validToDate = nowFactory()
            }
          }

          // The court of appeals enters the date a verdict appeal ended
          // itself, so it is kept; any other appeal is dated by its completion,
          // also when it is completed again after being reopened.
          if (appealCase.appealType === AppealCaseType.VERDICT) {
            return {
              caseUpdate,
              appealCaseUpdate: { appealState: AppealCaseState.COMPLETED },
            }
          }

          return {
            caseUpdate,
            appealCaseUpdate: {
              appealState: AppealCaseState.COMPLETED,
              appealRulingDate: nowFactory(),
            },
          }
        },
      },
    ],
    [
      AppealCaseTransition.REOPEN_APPEAL,
      {
        fromAppealStates: [AppealCaseState.COMPLETED],
        fromVerdictAppealStates: [],
        transition: (): AppealTransitionResult => ({
          caseUpdate: {},
          appealCaseUpdate: { appealState: AppealCaseState.RECEIVED },
        }),
      },
    ],
    [
      AppealCaseTransition.WITHDRAW_APPEAL,
      {
        fromAppealStates: [AppealCaseState.APPEALED, AppealCaseState.RECEIVED],
        fromVerdictAppealStates: [
          AppealCaseState.APPEALED,
          AppealCaseState.RECEIVED,
        ],
        transition: (
          _: Case,
          appealCase: AppealCase,
        ): AppealTransitionResult => {
          if (
            !appealCase.appealRulingDecision &&
            appealCase.appealState === AppealCaseState.RECEIVED
          ) {
            return {
              caseUpdate: {},
              appealCaseUpdate: {
                appealState: AppealCaseState.WITHDRAWN,
                appealRulingDecision: AppealCaseRulingDecision.DISCONTINUED,
              },
            }
          }

          return {
            caseUpdate: {},
            appealCaseUpdate: { appealState: AppealCaseState.WITHDRAWN },
          }
        },
      },
    ],
  ])

export const transitionAppealCase = (
  transition: AppealCaseTransition,
  theCase: Case,
  appealCase: AppealCase,
): AppealTransitionResult => {
  const currentAppealState = appealCase.appealState

  const rule = appealCaseStateMachine.get(transition)

  if (!rule) {
    throw new ForbiddenException(
      `The transition ${transition} is not a valid appeal case transition`,
    )
  }

  const isVerdictAppeal = appealCase.appealType === AppealCaseType.VERDICT
  const fromAppealStates = isVerdictAppeal
    ? rule.fromVerdictAppealStates
    : rule.fromAppealStates

  if (!currentAppealState || !fromAppealStates.includes(currentAppealState)) {
    throw new ForbiddenException(
      `The appeal transition ${transition} cannot be applied to ${
        isVerdictAppeal ? 'a verdict appeal' : 'an appeal case'
      } in state ${currentAppealState}`,
    )
  }

  return rule.transition(theCase, appealCase)
}
