import { ForbiddenException } from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseTransition,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'

type TransitionRule = (theCase: Case, user: User) => boolean

const defaultTransitionRule: TransitionRule = () => true

const completeTransitionRule: TransitionRule = (theCase, user) => {
  if (theCase.type !== CaseType.INDICTMENT) {
    throw new ForbiddenException(
      `Forbidden transition for ${theCase.type} cases`,
    )
  }

  if (
    theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING ||
    theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.DISMISSAL
  ) {
    return user.id === theCase.judgeId
  }

  return true
}

const transitionRuleMap: Partial<Record<CaseTransition, TransitionRule>> = {
  [CaseTransition.COMPLETE]: completeTransitionRule,
}

export const getTransitionRule = (
  transition: CaseTransition,
): TransitionRule => {
  return transitionRuleMap[transition] || defaultTransitionRule
}
