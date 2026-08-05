import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
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

interface AppealCaseRule {
  fromAppealStates: AppealCaseState[]
  transition: AppealTransition
}

const appealCaseStateMachine: Map<AppealCaseTransition, AppealCaseRule> =
  new Map([
    [
      AppealCaseTransition.RECEIVE_APPEAL,
      {
        fromAppealStates: [AppealCaseState.APPEALED],
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

  if (
    !currentAppealState ||
    !rule.fromAppealStates.includes(currentAppealState)
  ) {
    throw new ForbiddenException(
      `The appeal transition ${transition} cannot be applied to an appeal case in state ${currentAppealState}`,
    )
  }

  return rule.transition(theCase, appealCase)
}
