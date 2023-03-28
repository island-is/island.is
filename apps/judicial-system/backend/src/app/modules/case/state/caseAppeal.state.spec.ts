import each from 'jest-each'

import { ForbiddenException } from '@nestjs/common'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

import { transitionAppealCase } from './caseAppeal.state'

describe('Transition Case', () => {
  each`
      transition                        | caseState               | currentAppealState           | newAppealState
      ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}   | ${undefined}                 | ${CaseAppealState.APPEALED}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}   | ${CaseAppealState.APPEALED}  | ${CaseAppealState.RECEIVED}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}   | ${CaseAppealState.RECEIVED}  | ${CaseAppealState.COMPLETED}
      ${CaseTransition.APPEAL}          | ${CaseState.REJECTED}   | ${undefined}                 | ${CaseAppealState.APPEALED}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.REJECTED}   | ${CaseAppealState.APPEALED}  | ${CaseAppealState.RECEIVED}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.REJECTED}   | ${CaseAppealState.RECEIVED}  | ${CaseAppealState.COMPLETED}
      ${CaseTransition.ACCEPT}          | ${CaseState.NEW}        | ${undefined}                 | ${undefined}
    `.it(
    'should $transition case with $currentAppealState appeal state resulting in a $newAppealState appeal state',
    ({ transition, caseState, currentAppealState, newAppealState }) => {
      // Act
      const res = transitionAppealCase(
        transition,
        caseState,
        currentAppealState,
      )

      // Assert
      expect(res).toBe(newAppealState)
    },
  )

  each`
        transition                        | caseState                 |   currentAppealState
        ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}     |   ${CaseAppealState.APPEALED}
        ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}     |   ${CaseAppealState.RECEIVED}
        ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}     |   ${CaseAppealState.COMPLETED}
        ${CaseTransition.APPEAL}          | ${CaseState.NEW}          |   ${undefined}
        ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}     |   ${undefined}
        ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}     |   ${CaseAppealState.RECEIVED}
        ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}     |   ${CaseAppealState.COMPLETED}
        ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.NEW}          |   ${CaseAppealState.APPEALED}
        ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}     |   ${undefined}
        ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}     |   ${CaseAppealState.APPEALED}
        ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}     |   ${CaseAppealState.COMPLETED}
        ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.NEW}          |   ${CaseAppealState.RECEIVED}
        
    `.it(
    'should not $transition case with $currentAppealState appeal state and $caseState case state',
    ({ transition, caseState, currentAppealState }) => {
      // Arrange
      const act = () =>
        transitionAppealCase(transition, caseState, currentAppealState)

      // Act and assert
      expect(act).toThrow(ForbiddenException)
    },
  )
})
