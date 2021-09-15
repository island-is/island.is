import { ForbiddenException } from '@nestjs/common'

import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

import { transitionCase } from './case.state'

describe('Transition Case', () => {
  it('should open a new case', () => {
    // Act
    const res = transitionCase(CaseTransition.OPEN, CaseState.NEW)

    // Assert
    expect(res).toBe(CaseState.DRAFT)
  })

  it('should not open an opened case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.DRAFT)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open a submitted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open a received case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.RECEIVED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open a dismissed case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not open a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.OPEN, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit a new case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.NEW)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should submit an opened case', () => {
    // Act
    const res = transitionCase(CaseTransition.SUBMIT, CaseState.DRAFT)

    // Assert
    expect(res).toStrictEqual(CaseState.SUBMITTED)
  })

  it('should not submit a submitted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit a received case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.RECEIVED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit a dismissed case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not submit a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.SUBMIT, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive a new case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.NEW)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive an opened case', () => {
    // Act
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.DRAFT)

    // Assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should receive a submitted case', () => {
    // Arrange
    const res = transitionCase(CaseTransition.RECEIVE, CaseState.SUBMITTED)

    // Act and assert
    expect(res).toStrictEqual(CaseState.RECEIVED)
  })

  it('should not receive a received case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.RECEIVED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive a dismissed case', () => {
    // Arrange
    const act = () =>
      transitionCase(CaseTransition.RECEIVE, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not receive a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.RECEIVE, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept a new case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.NEW)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept an opened case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.DRAFT)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept an submitted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should accept a received case', () => {
    // Act
    const res = transitionCase(CaseTransition.ACCEPT, CaseState.RECEIVED)

    // Assert
    expect(res).toStrictEqual(CaseState.ACCEPTED)
  })

  it('should not accept an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept a dismissed case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not accept a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.ACCEPT, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject a new case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.NEW)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject an opened case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.DRAFT)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject a submitted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should reject a received case', () => {
    // Act
    const res = transitionCase(CaseTransition.REJECT, CaseState.RECEIVED)

    // Assert
    expect(res).toStrictEqual(CaseState.REJECTED)
  })

  it('should not reject an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject a dismissed case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not reject a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.REJECT, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss a new case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DISMISS, CaseState.NEW)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss an opened case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DISMISS, CaseState.DRAFT)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss a submitted case', () => {
    // Arrange
    const act = () =>
      transitionCase(CaseTransition.DISMISS, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should dismiss a received case', () => {
    // Act
    const res = transitionCase(CaseTransition.DISMISS, CaseState.RECEIVED)

    // Assert
    expect(res).toStrictEqual(CaseState.DISMISSED)
  })

  it('should not dismiss an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DISMISS, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DISMISS, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss a dismissed case', () => {
    // Arrange
    const act = () =>
      transitionCase(CaseTransition.DISMISS, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not dismiss a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DISMISS, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should delete a new case', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.NEW)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should delete an opened case', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.DRAFT)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should delete a submitted case', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.SUBMITTED)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should delete a received case', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.RECEIVED)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should not delete an accepted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DELETE, CaseState.ACCEPTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not delete a rejected case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DELETE, CaseState.REJECTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not delete a dismissed case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DELETE, CaseState.DISMISSED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })

  it('should not delete a deleted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DELETE, CaseState.DELETED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
  })
})
