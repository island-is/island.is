import each from 'jest-each'

import { ForbiddenException } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

import { transitionCase } from './case.state'

describe('Transition Case', () => {
  each`
      transition                | oldState               | newState
      ${CaseTransition.OPEN}    | ${CaseState.New}       | ${CaseState.Draft}
      ${CaseTransition.SUBMIT}  | ${CaseState.Draft}     | ${CaseState.Submitted}
      ${CaseTransition.RECEIVE} | ${CaseState.Submitted} | ${CaseState.Received}
      ${CaseTransition.ACCEPT}  | ${CaseState.Received}  | ${CaseState.Accepted}
      ${CaseTransition.REJECT}  | ${CaseState.Received}  | ${CaseState.Rejected}
      ${CaseTransition.DISMISS} | ${CaseState.Received}  | ${CaseState.Dismissed}
      ${CaseTransition.DELETE}  | ${CaseState.New}       | ${CaseState.Deleted}
      ${CaseTransition.DELETE}  | ${CaseState.Draft}     | ${CaseState.Deleted}
      ${CaseTransition.DELETE}  | ${CaseState.Submitted} | ${CaseState.Deleted}
      ${CaseTransition.DELETE}  | ${CaseState.Received}  | ${CaseState.Deleted}
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
      ${CaseTransition.OPEN}    | ${CaseState.Draft}
      ${CaseTransition.OPEN}    | ${CaseState.Submitted}
      ${CaseTransition.OPEN}    | ${CaseState.Received}
      ${CaseTransition.OPEN}    | ${CaseState.Accepted}
      ${CaseTransition.OPEN}    | ${CaseState.Rejected}
      ${CaseTransition.OPEN}    | ${CaseState.Dismissed}
      ${CaseTransition.OPEN}    | ${CaseState.Deleted}
      ${CaseTransition.SUBMIT}  | ${CaseState.New}
      ${CaseTransition.SUBMIT}  | ${CaseState.Submitted}
      ${CaseTransition.SUBMIT}  | ${CaseState.Received}
      ${CaseTransition.SUBMIT}  | ${CaseState.Accepted}
      ${CaseTransition.SUBMIT}  | ${CaseState.Rejected}
      ${CaseTransition.SUBMIT}  | ${CaseState.Dismissed}
      ${CaseTransition.SUBMIT}  | ${CaseState.Deleted}
      ${CaseTransition.RECEIVE} | ${CaseState.New}
      ${CaseTransition.RECEIVE} | ${CaseState.Draft}
      ${CaseTransition.RECEIVE} | ${CaseState.Received}
      ${CaseTransition.RECEIVE} | ${CaseState.Accepted}
      ${CaseTransition.RECEIVE} | ${CaseState.Rejected}
      ${CaseTransition.RECEIVE} | ${CaseState.Dismissed}
      ${CaseTransition.RECEIVE} | ${CaseState.Deleted}
      ${CaseTransition.ACCEPT}  | ${CaseState.New}
      ${CaseTransition.ACCEPT}  | ${CaseState.Draft}
      ${CaseTransition.ACCEPT}  | ${CaseState.Submitted}
      ${CaseTransition.ACCEPT}  | ${CaseState.Accepted}
      ${CaseTransition.ACCEPT}  | ${CaseState.Rejected}
      ${CaseTransition.ACCEPT}  | ${CaseState.Dismissed}
      ${CaseTransition.ACCEPT}  | ${CaseState.Deleted}
      ${CaseTransition.REJECT}  | ${CaseState.New}
      ${CaseTransition.REJECT}  | ${CaseState.Draft}
      ${CaseTransition.REJECT}  | ${CaseState.Submitted}
      ${CaseTransition.REJECT}  | ${CaseState.Accepted}
      ${CaseTransition.REJECT}  | ${CaseState.Rejected}
      ${CaseTransition.REJECT}  | ${CaseState.Dismissed}
      ${CaseTransition.REJECT}  | ${CaseState.Deleted}
      ${CaseTransition.DISMISS} | ${CaseState.New}
      ${CaseTransition.DISMISS} | ${CaseState.Draft}
      ${CaseTransition.DISMISS} | ${CaseState.Submitted}
      ${CaseTransition.DISMISS} | ${CaseState.Accepted}
      ${CaseTransition.DISMISS} | ${CaseState.Rejected}
      ${CaseTransition.DISMISS} | ${CaseState.Dismissed}
      ${CaseTransition.DISMISS} | ${CaseState.Deleted}
      ${CaseTransition.DELETE}  | ${CaseState.Accepted}
      ${CaseTransition.DELETE}  | ${CaseState.Rejected}
      ${CaseTransition.DELETE}  | ${CaseState.Dismissed}
      ${CaseTransition.DELETE}  | ${CaseState.Deleted}
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
