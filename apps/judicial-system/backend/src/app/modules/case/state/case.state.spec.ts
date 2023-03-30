import each from 'jest-each'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

import { transitionCase } from './case.state'

describe('Transition Case', () => {
  each`
      transition                        | oldState               | newState                 | currentAppealState         | newAppealState  
      ${CaseTransition.OPEN}            | ${CaseState.NEW}       | ${CaseState.DRAFT}       | ${undefined}               | ${undefined}
      ${CaseTransition.SUBMIT}          | ${CaseState.DRAFT}     | ${CaseState.SUBMITTED}   | ${undefined}               | ${undefined}
      ${CaseTransition.RECEIVE}         | ${CaseState.SUBMITTED} | ${CaseState.RECEIVED}    | ${undefined}               | ${undefined}
      ${CaseTransition.ACCEPT}          | ${CaseState.RECEIVED}  | ${CaseState.ACCEPTED}    | ${undefined}               | ${undefined}
      ${CaseTransition.REJECT}          | ${CaseState.RECEIVED}  | ${CaseState.REJECTED}    | ${undefined}               | ${undefined}
      ${CaseTransition.DISMISS}         | ${CaseState.RECEIVED}  | ${CaseState.DISMISSED}   | ${undefined}               | ${undefined}
      ${CaseTransition.DELETE}          | ${CaseState.NEW}       | ${CaseState.DELETED}     | ${undefined}               | ${undefined}
      ${CaseTransition.DELETE}          | ${CaseState.DRAFT}     | ${CaseState.DELETED}     | ${undefined}               | ${undefined}
      ${CaseTransition.DELETE}          | ${CaseState.SUBMITTED} | ${CaseState.DELETED}     | ${undefined}               | ${undefined}
      ${CaseTransition.DELETE}          | ${CaseState.RECEIVED}  | ${CaseState.DELETED}     | ${undefined}               | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.ACCEPTED}  | ${CaseState.RECEIVED}    | ${undefined}               | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.REJECTED}  | ${CaseState.RECEIVED}    | ${undefined}               | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.DISMISSED} | ${CaseState.RECEIVED}    | ${undefined}               | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}  | ${undefined}             | ${undefined}               | ${CaseAppealState.APPEALED}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}  | ${undefined}             | ${CaseAppealState.APPEALED}| ${CaseAppealState.RECEIVED}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}  | ${undefined}             | ${CaseAppealState.RECEIVED}| ${CaseAppealState.COMPLETED}
      ${CaseTransition.APPEAL}          | ${CaseState.REJECTED}  | ${undefined}             | ${undefined}               | ${CaseAppealState.APPEALED}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.REJECTED}  | ${undefined}             | ${CaseAppealState.APPEALED}| ${CaseAppealState.RECEIVED}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.REJECTED}  | ${undefined}             | ${CaseAppealState.RECEIVED}| ${CaseAppealState.COMPLETED}
    `.it(
    'should $transition $oldState case resulting in $newState case',
    ({ transition, oldState, newState, currentAppealState }) => {
      // Act
      const res = transitionCase(transition, oldState, currentAppealState)

      // Assert
      expect(res.state).toBe(newState)
    },
  )

  each`
      transition                    | oldState                | currentAppealState
      ${CaseTransition.OPEN}        | ${CaseState.DRAFT}      | ${undefined} 
      ${CaseTransition.OPEN}    | ${CaseState.SUBMITTED}  | ${undefined} 
      ${CaseTransition.OPEN}    | ${CaseState.RECEIVED}   | ${undefined} 
      ${CaseTransition.OPEN}    | ${CaseState.ACCEPTED}   | ${undefined} 
      ${CaseTransition.OPEN}    | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.OPEN}    | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.OPEN}    | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.RECEIVED}   | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.SUBMIT}  | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.RECEIVED}   | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.RECEIVE} | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.ACCEPT}  | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.REJECT}  | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.DISMISS} | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.DELETE}  | ${CaseState.ACCEPTED}   | ${undefined}
      ${CaseTransition.DELETE}  | ${CaseState.REJECTED}   | ${undefined}
      ${CaseTransition.DELETE}  | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.DELETE}  | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.REOPEN}  | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.REOPEN}          | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.RECEIVED}   | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.APPEAL}          | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.RECEIVED}   | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DELETED}    | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.NEW}        | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DRAFT}      | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.SUBMITTED}  | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.RECEIVED}   | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DISMISSED}  | ${undefined}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DELETED}    | ${undefined}
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
