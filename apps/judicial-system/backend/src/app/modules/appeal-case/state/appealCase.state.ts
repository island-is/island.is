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

// A verdict appeal moves through fewer states than a ruling appeal: it is
// never received, so it is concluded from the state it is filed in, and it is
// neither received nor reopened. Each rule therefore names the states it
// applies from for a verdict appeal separately; an empty list refuses the
// transition for verdict appeals altogether.
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
      AppealCaseTransition.COMPLETE_APPEAL,
      {
        fromAppealStates: [AppealCaseState.RECEIVED, AppealCaseState.WITHDRAWN],
        fromVerdictAppealStates: [AppealCaseState.APPEALED],
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
