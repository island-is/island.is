import {
  CaseState,
  CaseTransition,
  UserRole,
} from '@island.is/judicial-system/types'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { transitionCase } from './case.state'

describe('Transition Case', () => {
  describe('Prosecutor Transitions', () => {
    // Arrange
    const prosecutorId = 'some-random-prosecutor-id'

    it('should open a new case', () => {
      // Act
      const res = transitionCase(
        CaseTransition.OPEN,
        CaseState.NEW,
        prosecutorId,
        UserRole.PROSECUTOR,
      )

      // Assert
      expect(res).toStrictEqual({
        state: CaseState.DRAFT,
        prosecutorId,
      })
    })

    it('should submit an opened case', () => {
      // Act
      const res = transitionCase(
        CaseTransition.SUBMIT,
        CaseState.DRAFT,
        prosecutorId,
        UserRole.PROSECUTOR,
      )

      // Assert
      expect(res).toStrictEqual({
        state: CaseState.SUBMITTED,
        prosecutorId,
      })
    })

    it('should not accept a subitted case', () => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.ACCEPT,
          CaseState.SUBMITTED,
          prosecutorId,
          UserRole.PROSECUTOR,
        )

      // Act and assert
      expect(act).toThrow(UnauthorizedException)
    })

    it('should not reject a submitted case', () => {
      // Arrange
      const act = () =>
        transitionCase(
          CaseTransition.REJECT,
          CaseState.SUBMITTED,
          prosecutorId,
          UserRole.PROSECUTOR,
        )

      // Act and assert
      expect(act).toThrow(UnauthorizedException)
    })

    describe('Judge Transitions', () => {
      // Arrange
      const judgeId = 'some-random-judge-id'

      it('should accept a submitted case', () => {
        // Act
        const res = transitionCase(
          CaseTransition.ACCEPT,
          CaseState.SUBMITTED,
          judgeId,
          UserRole.JUDGE,
        )

        // Assert
        expect(res).toStrictEqual({
          state: CaseState.ACCEPTED,
          judgeId,
        })
      })

      it('should reject a submitted case', () => {
        // Act
        const res = transitionCase(
          CaseTransition.REJECT,
          CaseState.SUBMITTED,
          judgeId,
          UserRole.JUDGE,
        )

        // Assert
        expect(res).toStrictEqual({
          state: CaseState.REJECTED,
          judgeId,
        })
      })

      it('should not open a new case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            CaseState.NEW,
            judgeId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(UnauthorizedException)
      })

      it('should not submit an opened case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            CaseState.DRAFT,
            judgeId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(UnauthorizedException)
      })
    })

    describe('Forbidden Transactions', () => {
      const userId = 'some-random-user-id'

      it('should not open an opened case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            CaseState.DRAFT,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not open a submitted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            CaseState.SUBMITTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not open an accepted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            CaseState.ACCEPTED,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not open a rejected case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.OPEN,
            CaseState.REJECTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not submit a new case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            CaseState.NEW,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not submit a submitted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            CaseState.SUBMITTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not submit an accepted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            CaseState.ACCEPTED,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not submit a rejected case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.SUBMIT,
            CaseState.REJECTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not accept a new case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            CaseState.NEW,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not accept an opened case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            CaseState.DRAFT,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not accept an accepted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            CaseState.ACCEPTED,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not accept a rejected case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.ACCEPT,
            CaseState.REJECTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reject a new case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            CaseState.NEW,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reject an opened case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            CaseState.DRAFT,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reject an accepted case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            CaseState.ACCEPTED,
            userId,
            UserRole.PROSECUTOR,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })

      it('should not reject a rejected case', () => {
        // Arrange
        const act = () =>
          transitionCase(
            CaseTransition.REJECT,
            CaseState.REJECTED,
            userId,
            UserRole.JUDGE,
          )

        // Act and assert
        expect(act).toThrow(ForbiddenException)
      })
    })
  })
})
