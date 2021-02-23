import { Op } from 'sequelize'

import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import {
  getCasesQueryFilter,
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

describe('getCasesQueryFilter', () => {
  it('should get prosecutor filter', () => {
    // Arrange
    const user = {
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Institution Id',
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        {
          [Op.not]: {
            state: [CaseState.DELETED],
          },
        },
        {
          [Op.or]: [
            { prosecutor_id: { [Op.is]: null } }, // eslint-disable-line @typescript-eslint/camelcase
            {
              '$prosecutor.institution_id$': 'Institution Id',
            },
          ],
        },
      ],
    })
  })

  it('should get other role filter', () => {
    // Arrange
    const user = {
      role: UserRole.JUDGE,
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.not]: {
        state: [CaseState.DELETED, CaseState.NEW],
      },
    })
  })
})
