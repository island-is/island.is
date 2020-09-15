import { UserRole, hasRole } from './authenticate'

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
