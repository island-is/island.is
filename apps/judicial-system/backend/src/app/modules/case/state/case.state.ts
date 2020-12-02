import { ForbiddenException, UnauthorizedException } from '@nestjs/common'

import {
  CaseState,
  CaseTransition,
  UserRole,
} from '@island.is/judicial-system/types'

interface Agent {
  role: UserRole
  userKey: string
}

interface Rule {
  from: CaseState[]
  to: CaseState
  agent: Agent
}

export interface TransitionUpdate {
  state: CaseState
  prosecutorId?: string
  judgeId?: string
}

const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [
    CaseTransition.OPEN,
    {
      from: [CaseState.NEW],
      to: CaseState.DRAFT,
      agent: { role: UserRole.PROSECUTOR, userKey: 'prosecutorId' },
    },
  ],
  [
    CaseTransition.SUBMIT,
    {
      from: [CaseState.DRAFT],
      to: CaseState.SUBMITTED,
      agent: { role: UserRole.PROSECUTOR, userKey: 'prosecutorId' },
    },
  ],
  [
    CaseTransition.ACCEPT,
    {
      from: [CaseState.SUBMITTED],
      to: CaseState.ACCEPTED,
      agent: { role: UserRole.JUDGE, userKey: 'judgeId' },
    },
  ],
  [
    CaseTransition.REJECT,
    {
      from: [CaseState.SUBMITTED],
      to: CaseState.REJECTED,
      agent: { role: UserRole.JUDGE, userKey: 'judgeId' },
    },
  ],
  [
    CaseTransition.DELETE,
    {
      from: [CaseState.NEW, CaseState.DRAFT],
      to: CaseState.DELETED,
      agent: { role: UserRole.PROSECUTOR, userKey: 'prosecutorId' },
    },
  ],
])

export const transitionCase = function (
  transition: CaseTransition,
  currentState: CaseState,
  userId: string,
  userRole: UserRole,
): TransitionUpdate {
  const rule: Rule = caseStateMachine.get(transition)

  if (!rule?.from.includes(currentState)) {
    throw new ForbiddenException(
      `The transition ${transition} cannot be applied to a case in state ${currentState}`,
    )
  }

  const agent: Agent = rule.agent

  if (userRole !== agent.role) {
    throw new UnauthorizedException(
      `The transition ${transition} cannot be applied by a user with role ${userRole}`,
    )
  }

  const update: TransitionUpdate = { state: rule.to }

  update[agent.userKey] = userId

  return update
}
