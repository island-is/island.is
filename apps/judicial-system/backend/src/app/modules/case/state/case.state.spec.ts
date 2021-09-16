import each from 'jest-each'

import { ForbiddenException } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

import { transitionCase } from './case.state'

describe('Transition Case', () => {
  each`
      transition                | oldState               | newState
      ${CaseTransition.OPEN}    | ${CaseState.NEW}       | ${CaseState.DRAFT}
      ${CaseTransition.SUBMIT}  | ${CaseState.DRAFT}     | ${CaseState.SUBMITTED}
      ${CaseTransition.RECEIVE} | ${CaseState.SUBMITTED} | ${CaseState.RECEIVED}
      ${CaseTransition.ACCEPT}  | ${CaseState.RECEIVED}  | ${CaseState.ACCEPTED}
      ${CaseTransition.REJECT}  | ${CaseState.RECEIVED}  | ${CaseState.REJECTED}
      ${CaseTransition.DISMISS} | ${CaseState.RECEIVED}  | ${CaseState.DISMISSED}
      ${CaseTransition.DELETE}  | ${CaseState.NEW}       | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.DRAFT}     | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.SUBMITTED} | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.RECEIVED}  | ${CaseState.DELETED}
    `.it(
    'should $transition $oldState case resulting in $newState case',
    ({ transition, oldState, newState }) => {
      // Act
      const res = transitionCase(transition, oldState)

      // Assert
      expect(res).toBe(newState)
    },
  )

  each`
      transition                | oldState
      ${CaseTransition.OPEN}    | ${CaseState.DRAFT}
      ${CaseTransition.OPEN}    | ${CaseState.SUBMITTED}
      ${CaseTransition.OPEN}    | ${CaseState.RECEIVED}
      ${CaseTransition.OPEN}    | ${CaseState.ACCEPTED}
      ${CaseTransition.OPEN}    | ${CaseState.REJECTED}
      ${CaseTransition.OPEN}    | ${CaseState.DISMISSED}
      ${CaseTransition.OPEN}    | ${CaseState.DELETED}
      ${CaseTransition.SUBMIT}  | ${CaseState.NEW}
      ${CaseTransition.SUBMIT}  | ${CaseState.SUBMITTED}
      ${CaseTransition.SUBMIT}  | ${CaseState.RECEIVED}
      ${CaseTransition.SUBMIT}  | ${CaseState.ACCEPTED}
      ${CaseTransition.SUBMIT}  | ${CaseState.REJECTED}
      ${CaseTransition.SUBMIT}  | ${CaseState.DISMISSED}
      ${CaseTransition.SUBMIT}  | ${CaseState.DELETED}
      ${CaseTransition.RECEIVE} | ${CaseState.NEW}
      ${CaseTransition.RECEIVE} | ${CaseState.DRAFT}
      ${CaseTransition.RECEIVE} | ${CaseState.RECEIVED}
      ${CaseTransition.RECEIVE} | ${CaseState.ACCEPTED}
      ${CaseTransition.RECEIVE} | ${CaseState.REJECTED}
      ${CaseTransition.RECEIVE} | ${CaseState.DISMISSED}
      ${CaseTransition.RECEIVE} | ${CaseState.DELETED}
      ${CaseTransition.ACCEPT}  | ${CaseState.NEW}
      ${CaseTransition.ACCEPT}  | ${CaseState.DRAFT}
      ${CaseTransition.ACCEPT}  | ${CaseState.SUBMITTED}
      ${CaseTransition.ACCEPT}  | ${CaseState.ACCEPTED}
      ${CaseTransition.ACCEPT}  | ${CaseState.REJECTED}
      ${CaseTransition.ACCEPT}  | ${CaseState.DISMISSED}
      ${CaseTransition.ACCEPT}  | ${CaseState.DELETED}
      ${CaseTransition.REJECT}  | ${CaseState.NEW}
      ${CaseTransition.REJECT}  | ${CaseState.DRAFT}
      ${CaseTransition.REJECT}  | ${CaseState.SUBMITTED}
      ${CaseTransition.REJECT}  | ${CaseState.ACCEPTED}
      ${CaseTransition.REJECT}  | ${CaseState.REJECTED}
      ${CaseTransition.REJECT}  | ${CaseState.DISMISSED}
      ${CaseTransition.REJECT}  | ${CaseState.DELETED}
      ${CaseTransition.DISMISS} | ${CaseState.NEW}
      ${CaseTransition.DISMISS} | ${CaseState.DRAFT}
      ${CaseTransition.DISMISS} | ${CaseState.SUBMITTED}
      ${CaseTransition.DISMISS} | ${CaseState.ACCEPTED}
      ${CaseTransition.DISMISS} | ${CaseState.REJECTED}
      ${CaseTransition.DISMISS} | ${CaseState.DISMISSED}
      ${CaseTransition.DISMISS} | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.ACCEPTED}
      ${CaseTransition.DELETE}  | ${CaseState.REJECTED}
      ${CaseTransition.DELETE}  | ${CaseState.DISMISSED}
      ${CaseTransition.DELETE}  | ${CaseState.DELETED}
    `.it(
    'should not $transition $oldState case',
    ({ transition, oldState }) => {
      // Arrange
      const act = () => transitionCase(transition, oldState)

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    },
  )
})
