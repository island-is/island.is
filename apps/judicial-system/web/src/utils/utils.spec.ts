import { UserRole, hasRole } from './authenticate'
import { parseArray, parseString } from './formatters'

describe('Authenticate utils', () => {
  describe('HasRole util', () => {
    test('should accurately determine if a role is in a list of roles', () => {
      // Arrange
      const procAndJudge = [UserRole.PROCECUTOR, UserRole.JUDGE]
      const judge = [UserRole.JUDGE]

      // Act
      const hasProcecutorRole = hasRole(procAndJudge, UserRole.PROCECUTOR)
      const hasJudgeRole = hasRole(procAndJudge, UserRole.JUDGE)
      const judgeHasProcRole = hasRole(judge, UserRole.PROCECUTOR)
      const hasNoRole = hasRole([], UserRole.PROCECUTOR)

      // Assert
      expect(hasProcecutorRole).toBeTruthy()
      expect(hasJudgeRole).toBeTruthy()
      expect(judgeHasProcRole).toBeFalsy()
      expect(hasNoRole).toBeFalsy()
    })
  })
})

describe('Formatters utils', () => {
  describe('Parse array', () => {
    test('given a property name and an array of strings should parse correctly into JSON', () => {
      // Arrange
      const property = 'test'
      const array = ['lorem', 'ipsum']

      // Act
      const parsedArray = parseArray(property, array)

      // Assert
      expect(parsedArray).not.toEqual(null)
      expect(parsedArray).toEqual({ test: ['lorem', 'ipsum'] })
    })
  })

  describe('Parse string', () => {
    test('given a property name and a value should parse correctly into JSON', () => {
      // Arrange
      const property = 'test'
      const value = 'lorem'

      // Act
      const parsedString = parseString(property, value)

      // Assert
      expect(parsedString).toEqual({ test: 'lorem' })
    })
  })
})
