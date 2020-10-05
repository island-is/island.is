import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import { ForbiddenException } from '@nestjs/common'

import { User, UserRole } from '../user'
import { TransitionCaseDto } from './dto'
import { Case } from './models'

interface Agent {
  role: UserRole
  userKey: string
}

interface Rule {
  from: CaseState
  to: CaseState
  agent: Agent
}

export interface TransitionUpdate {
  state: CaseState
  prosecutor?: string
  judge?: string
}

const caseStateMachine: Map<CaseTransition, Rule> = new Map([
  [
    CaseTransition.SUBMIT,
    {
      from: CaseState.DRAFT,
      to: CaseState.SUBMITTED,
      agent: { role: UserRole.PROSECUTOR, userKey: 'prosecutorId' },
    },
  ],
  [
    CaseTransition.ACCEPT,
    {
      from: CaseState.SUBMITTED,
      to: CaseState.ACCEPTED,
      agent: { role: UserRole.JUDGE, userKey: 'judgeId' },
    },
  ],
  [
    CaseTransition.REJECT,
    {
      from: CaseState.SUBMITTED,
      to: CaseState.REJECTED,
      agent: { role: UserRole.JUDGE, userKey: 'judgeId' },
    },
  ],
])

export const transitionCase = function (
  transition: TransitionCaseDto,
  existingCase: Case,
  user: User,
): TransitionUpdate {
  const rule: Rule = caseStateMachine.get(transition.transition)

  if (rule?.from !== existingCase.state) {
    throw new ForbiddenException(
      `The transition ${transition.transition} cannot be applied to a case in state ${existingCase.state}`,
    )
  }

  const agent: Agent = rule.agent

  if (user.role !== agent.role) {
    throw new ForbiddenException(
      `The transition ${transition.transition} cannot be applied by a user with role ${user.role}`,
    )
  }

  const update: TransitionUpdate = { state: rule.to }

  update[agent.userKey] = user.id

  return update
}
