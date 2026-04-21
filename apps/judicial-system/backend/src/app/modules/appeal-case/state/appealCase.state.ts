import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealCaseTransition,
  CaseAppealRulingDecision,
  CaseDecision,
  CaseState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { Case, UpdateAppealCase, UpdateCase } from '../../repository'

export interface AppealTransitionResult {
  caseUpdate: UpdateCase
  appealCaseUpdate: UpdateAppealCase
}

type AppealTransition = (theCase: Case) => AppealTransitionResult

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
        transition: (theCase: Case): AppealTransitionResult => {
          const caseUpdate: UpdateCase = {}
          const currentDecision = theCase.decision

          if (
            isRestrictionCase(theCase.type) &&
            theCase.state === CaseState.ACCEPTED &&
            (currentDecision === CaseDecision.ACCEPTING ||
              currentDecision === CaseDecision.ACCEPTING_PARTIALLY)
          ) {
            const currentAppealRulingDecision =
              theCase.appealCase?.appealRulingDecision

            if (
              currentAppealRulingDecision ===
                CaseAppealRulingDecision.CHANGED ||
              currentAppealRulingDecision ===
                CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY
            ) {
              caseUpdate.validToDate = theCase.appealCase?.appealValidToDate
              caseUpdate.isCustodyIsolation =
                theCase.appealCase?.isAppealCustodyIsolation
              caseUpdate.isolationToDate =
                theCase.appealCase?.appealIsolationToDate
            } else if (
              currentAppealRulingDecision === CaseAppealRulingDecision.REPEAL
            ) {
              caseUpdate.validToDate = nowFactory()
            }
          }

          return {
            caseUpdate,
            appealCaseUpdate: { appealState: AppealCaseState.COMPLETED },
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
        transition: (theCase: Case): AppealTransitionResult => {
          if (
            !theCase.appealCase?.appealRulingDecision &&
            theCase.appealCase?.appealState === AppealCaseState.RECEIVED
          ) {
            return {
              caseUpdate: {},
              appealCaseUpdate: {
                appealState: AppealCaseState.WITHDRAWN,
                appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
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
): AppealTransitionResult => {
  const currentAppealState = theCase.appealCase?.appealState

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

  return rule.transition(theCase)
}
