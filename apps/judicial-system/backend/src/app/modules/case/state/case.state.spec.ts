import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import { ForbiddenException } from '@nestjs/common'
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

  it('should accept a submitted case', () => {
    // Act
    const res = transitionCase(CaseTransition.ACCEPT, CaseState.SUBMITTED)

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

  it('should reject a submitted case', () => {
    // Act
    const res = transitionCase(CaseTransition.REJECT, CaseState.SUBMITTED)

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

  it('should delete a new caes', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.NEW)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should delete an opened caes', () => {
    // Act
    const res = transitionCase(CaseTransition.DELETE, CaseState.DRAFT)

    // Assert
    expect(res).toStrictEqual(CaseState.DELETED)
  })

  it('should not delete a submitted case', () => {
    // Arrange
    const act = () => transitionCase(CaseTransition.DELETE, CaseState.SUBMITTED)

    // Act and assert
    expect(act).toThrow(ForbiddenException)
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
})
