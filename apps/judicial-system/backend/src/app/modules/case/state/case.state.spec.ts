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
      transition                        | oldState               | newState                
      ${CaseTransition.OPEN}            | ${CaseState.NEW}       | ${CaseState.DRAFT}      
      ${CaseTransition.SUBMIT}          | ${CaseState.DRAFT}     | ${CaseState.SUBMITTED}  
      ${CaseTransition.RECEIVE}         | ${CaseState.SUBMITTED} | ${CaseState.RECEIVED}    
      ${CaseTransition.ACCEPT}          | ${CaseState.RECEIVED}  | ${CaseState.ACCEPTED}  
      ${CaseTransition.REJECT}          | ${CaseState.RECEIVED}  | ${CaseState.REJECTED}    
      ${CaseTransition.DISMISS}         | ${CaseState.RECEIVED}  | ${CaseState.DISMISSED}   
      ${CaseTransition.DELETE}          | ${CaseState.NEW}       | ${CaseState.DELETED}     
      ${CaseTransition.DELETE}          | ${CaseState.DRAFT}     | ${CaseState.DELETED}   
      ${CaseTransition.DELETE}          | ${CaseState.SUBMITTED} | ${CaseState.DELETED}    
      ${CaseTransition.DELETE}          | ${CaseState.RECEIVED}  | ${CaseState.DELETED}    
      ${CaseTransition.REOPEN}          | ${CaseState.ACCEPTED}  | ${CaseState.RECEIVED}    
      ${CaseTransition.REOPEN}          | ${CaseState.REJECTED}  | ${CaseState.RECEIVED}                 
      ${CaseTransition.REOPEN}          | ${CaseState.DISMISSED} | ${CaseState.RECEIVED}                
    `.it(
    'should $transition $oldState case resulting in $newState case',
    ({ transition, oldState, newState }) => {
      // Act
      const res = transitionCase(transition, oldState)

      // Assert
      expect(res.state).toBe(newState)
    },
  )

  each`
  transition                        | oldState                   | currentAppealState         | newAppealState  
  ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}      | ${undefined}               | ${CaseAppealState.APPEALED}
  ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}      | ${CaseAppealState.APPEALED}| ${CaseAppealState.RECEIVED}
  ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}      | ${CaseAppealState.RECEIVED}| ${CaseAppealState.COMPLETED}
  ${CaseTransition.APPEAL}          | ${CaseState.REJECTED}      | ${undefined}               | ${CaseAppealState.APPEALED}
  ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.REJECTED}      | ${CaseAppealState.APPEALED}| ${CaseAppealState.RECEIVED}
  ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.REJECTED}      | ${CaseAppealState.RECEIVED}| ${CaseAppealState.COMPLETED}
`.it(
    'should $transition $oldState case with $currentAppealState appeal state resulting in case with $newState appeal state',
    ({ transition, oldState, currentAppealState, newAppealState }) => {
      // Act
      const res = transitionCase(transition, oldState, currentAppealState)

      // Assert
      expect(res.appealState).toBe(newAppealState)
    },
  )

  each`
      transition                        | oldState                
      ${CaseTransition.OPEN}            | ${CaseState.DRAFT}     
      ${CaseTransition.OPEN}            | ${CaseState.SUBMITTED}
      ${CaseTransition.OPEN}            | ${CaseState.RECEIVED}     
      ${CaseTransition.OPEN}            | ${CaseState.ACCEPTED}     
      ${CaseTransition.OPEN}            | ${CaseState.REJECTED}    
      ${CaseTransition.OPEN}            | ${CaseState.DISMISSED}   
      ${CaseTransition.OPEN}            | ${CaseState.DELETED}     
      ${CaseTransition.SUBMIT}          | ${CaseState.NEW}         
      ${CaseTransition.SUBMIT}          | ${CaseState.SUBMITTED}   
      ${CaseTransition.SUBMIT}          | ${CaseState.RECEIVED}    
      ${CaseTransition.SUBMIT}          | ${CaseState.ACCEPTED}    
      ${CaseTransition.SUBMIT}          | ${CaseState.REJECTED}    
      ${CaseTransition.SUBMIT}          | ${CaseState.DISMISSED}   
      ${CaseTransition.SUBMIT}          | ${CaseState.DELETED}     
      ${CaseTransition.RECEIVE}         | ${CaseState.NEW}         
      ${CaseTransition.RECEIVE}         | ${CaseState.DRAFT}       
      ${CaseTransition.RECEIVE}         | ${CaseState.RECEIVED}    
      ${CaseTransition.RECEIVE}         | ${CaseState.ACCEPTED}    
      ${CaseTransition.RECEIVE}         | ${CaseState.REJECTED}    
      ${CaseTransition.RECEIVE}         | ${CaseState.DISMISSED}   
      ${CaseTransition.RECEIVE}         | ${CaseState.DELETED}     
      ${CaseTransition.ACCEPT}          | ${CaseState.NEW}         
      ${CaseTransition.ACCEPT}          | ${CaseState.DRAFT}       
      ${CaseTransition.ACCEPT}          | ${CaseState.SUBMITTED}   
      ${CaseTransition.ACCEPT}          | ${CaseState.ACCEPTED}    
      ${CaseTransition.ACCEPT}          | ${CaseState.REJECTED}    
      ${CaseTransition.ACCEPT}          | ${CaseState.DISMISSED}   
      ${CaseTransition.ACCEPT}          | ${CaseState.DELETED}     
      ${CaseTransition.REJECT}          | ${CaseState.NEW}         
      ${CaseTransition.REJECT}          | ${CaseState.DRAFT}       
      ${CaseTransition.REJECT}          | ${CaseState.SUBMITTED}   
      ${CaseTransition.REJECT}          | ${CaseState.ACCEPTED}    
      ${CaseTransition.REJECT}          | ${CaseState.REJECTED}    
      ${CaseTransition.REJECT}          | ${CaseState.DISMISSED}   
      ${CaseTransition.REJECT}          | ${CaseState.DELETED}     
      ${CaseTransition.DISMISS}         | ${CaseState.NEW}         
      ${CaseTransition.DISMISS}         | ${CaseState.DRAFT}       
      ${CaseTransition.DISMISS}         | ${CaseState.SUBMITTED}   
      ${CaseTransition.DISMISS}         | ${CaseState.ACCEPTED}    
      ${CaseTransition.DISMISS}         | ${CaseState.REJECTED}    
      ${CaseTransition.DISMISS}         | ${CaseState.DISMISSED}   
      ${CaseTransition.DISMISS}         | ${CaseState.DELETED}     
      ${CaseTransition.DELETE}          | ${CaseState.ACCEPTED}    
      ${CaseTransition.DELETE}          | ${CaseState.REJECTED}    
      ${CaseTransition.DELETE}          | ${CaseState.DISMISSED}   
      ${CaseTransition.DELETE}          | ${CaseState.DELETED}     
      ${CaseTransition.REOPEN}          | ${CaseState.NEW}         
      ${CaseTransition.REOPEN}          | ${CaseState.DRAFT}       
      ${CaseTransition.REOPEN}          | ${CaseState.SUBMITTED}   
      ${CaseTransition.REOPEN}          | ${CaseState.DELETED}     
      ${CaseTransition.APPEAL}          | ${CaseState.NEW}         
      ${CaseTransition.APPEAL}          | ${CaseState.DRAFT}       
      ${CaseTransition.APPEAL}          | ${CaseState.SUBMITTED}   
      ${CaseTransition.APPEAL}          | ${CaseState.RECEIVED}    
      ${CaseTransition.APPEAL}          | ${CaseState.DISMISSED}   
      ${CaseTransition.APPEAL}          | ${CaseState.DELETED}     
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.NEW}         
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DRAFT}       
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.SUBMITTED}   
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.RECEIVED}    
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DISMISSED}   
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.DELETED}     
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.NEW}         
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DRAFT}       
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.SUBMITTED}   
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.RECEIVED}    
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DISMISSED}   
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.DELETED}     
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
