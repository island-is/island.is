import { makeCase } from '@island.is/judicial-system/formatters'
import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'
import { caseResult } from '.'

describe('Page layout utils', () => {
  describe('caseResult function', () => {
    it('should return an empty string workingCase parameter is not set', () => {
      // Arrange
      const workingCase = undefined

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('')
    })

    describe('isRejected', () => {
      it('should return the correct string if the case is an investigation case and the state is REJECTED', () => {
        // Arrange
        const workingCase = {
          ...makeCase(),
          type: CaseType.AUTOPSY,
          state: CaseState.REJECTED,
        }

        // Act
        const result = caseResult({ dismissedTitle: 'test' }, workingCase)

        // Assert
        expect(result).toEqual('Kröfu um rannsóknarheimild hafnað')
      })

      it(`should return the correct string if the case is an investigation case and it's parent case state is REJECTED`, () => {
        // Arrange
        const workingCase = {
          ...makeCase(),
          type: CaseType.AUTOPSY,
          parentCase: {
            ...makeCase(),
            state: CaseState.REJECTED,
          },
        }

        // Act
        const result = caseResult({ dismissedTitle: 'test' }, workingCase)

        // Assert
        expect(result).toEqual('Kröfu um rannsóknarheimild hafnað')
      })

      it('should return the correct string if the case is an restriction case and the state is REJECTED', () => {
        // Arrange
        const workingCase = {
          ...makeCase(),
          type: CaseType.TRAVEL_BAN,
          state: CaseState.REJECTED,
        }

        // Act
        const result = caseResult({ dismissedTitle: 'test' }, workingCase)

        // Assert
        expect(result).toEqual('Kröfu hafnað')
      })

      it(`should return the correct string if the case is an restriction case and it's parent case state is REJECTED`, () => {
        // Arrange
        const workingCase = {
          ...makeCase(),
          type: CaseType.CUSTODY,
          parentCase: {
            ...makeCase(),
            state: CaseState.REJECTED,
          },
        }

        // Act
        const result = caseResult({ dismissedTitle: 'test' }, workingCase)

        // Assert
        expect(result).toEqual('Kröfu hafnað')
      })
    })
  })

  describe('isAccepted', () => {
    it('should return the correct string if the case is an investigation case and the state is ACCEPTED', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.AUTOPSY,
        state: CaseState.ACCEPTED,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Krafa um rannsóknarheimild samþykkt')
    })

    it(`should return the correct string if the case is an investigation case and it's parent case state is ACCEPTED`, () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.AUTOPSY,
        parentCase: {
          ...makeCase(),
          state: CaseState.ACCEPTED,
        },
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Krafa um rannsóknarheimild samþykkt')
    })

    it('should return the correct string if the case is an restriction case and the state is ACCEPTED', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.TRAVEL_BAN,
        state: CaseState.ACCEPTED,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Farbann virkt')
    })

    it(`should return the correct string if the case is an restriction case and it's parent case state is ACCEPTED`, () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.CUSTODY,
        parentCase: {
          ...makeCase(),
          state: CaseState.ACCEPTED,
        },
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Gæsluvarðhald virkt')
    })

    it('should return the correct string if the case is an restriction case and the state is ACCEPTED and the valid to date is in the past', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.TRAVEL_BAN,
        state: CaseState.ACCEPTED,
        isValidToDateInThePast: true,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Farbanni lokið')
    })
  })

  describe('isDismissed', () => {
    it('should return the correct string if the case state is DISMISSED', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.AUTOPSY,
        state: CaseState.DISMISSED,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('test')
    })
  })

  describe('isAlternativeTravelBan', () => {
    it('should return the correct string if the case state is ACCEPTED and the case decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Gæsluvarðhald virkt')
    })

    it('should return the correct string if the case state is ACCEPTED, the case decision is ACCEPTING_ALTERNATIVE_TRAVEL_BAN and the valid to date is in the past', () => {
      // Arrange
      const workingCase = {
        ...makeCase(),
        type: CaseType.CUSTODY,
        state: CaseState.ACCEPTED,
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
        isValidToDateInThePast: true,
      }

      // Act
      const result = caseResult({ dismissedTitle: 'test' }, workingCase)

      // Assert
      expect(result).toEqual('Gæsluvarðhaldi lokið')
    })
  })
})
