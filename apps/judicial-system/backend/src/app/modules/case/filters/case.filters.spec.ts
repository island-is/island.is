import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import {
  isProsecutorInstitutionHiddenFromUser,
  isStateHiddenFromRole,
} from './case.filters'

describe('isStateVisibleToRole', () => {
  it('new should be visible to prosecutors', () => {
    // Arrange
    const state = CaseState.NEW
    const role = UserRole.PROSECUTOR

    // Act
    const res = isStateHiddenFromRole(state, role)

    // Assert
    expect(res).toBe(false)
  })

  it('new should be hidden from registrars', () => {
    // Arrange
    const state = CaseState.NEW
    const role = UserRole.REGISTRAR

    // Act
    const res = isStateHiddenFromRole(state, role)

    // Assert
    expect(res).toBe(true)
  })

  it('new should be hidden from judges', () => {
    // Arrange
    const state = CaseState.NEW
    const role = UserRole.JUDGE

    // Act
    const res = isStateHiddenFromRole(state, role)

    // Assert
    expect(res).toBe(true)
  })
})

describe('isProsecutorInstitutionHiddenFromUser', () => {
  it('other prosecutor institutions should be hidden from prosecutors', () => {
    // Arrange
    const prosecutorInstitutionId = 'Institution'
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { id: 'Another Institution' },
    }

    // Act
    const res = isProsecutorInstitutionHiddenFromUser(
      prosecutorInstitutionId,
      user as User,
    )

    // Assert
    expect(res).toBe(true)
  })

  it('own prosecutor institution should be visible to prosecutors', () => {
    // Arrange
    const prosecutorInstitutionId = 'Institution'
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { id: 'Institution' },
    }

    // Act
    const res = isProsecutorInstitutionHiddenFromUser(
      prosecutorInstitutionId,
      user as User,
    )

    // Assert
    expect(res).toBe(false)
  })
})
