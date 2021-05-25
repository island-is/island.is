import { Op } from 'sequelize'

import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import { getCasesQueryFilter, isCaseBlockedFromUser } from './case.filters'
import { Case } from '../models'

describe('isCaseBlockedFromUser', () => {
  it('deleted should be hidden from prosecutors', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = { role: UserRole.PROSECUTOR } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('deleted should be hidden from registrars', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = { role: UserRole.REGISTRAR } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('new should be hidden from registrars', () => {
    // Arrange
    const theCase = { state: CaseState.NEW } as Case
    const user = { role: UserRole.REGISTRAR } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('deleted should be hidden from judges', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = { role: UserRole.JUDGE } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('new should be hidden from judges', () => {
    // Arrange
    const theCase = { state: CaseState.NEW } as Case
    const user = { role: UserRole.JUDGE } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('other prosecutors offices should be hidden from prosecutors', () => {
    // Arrange
    const theCase = {
      state: CaseState.NEW,
      prosecutor: { institutionId: 'Prosecutors Office' },
    } as Case
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { id: 'Another Prosecutors Office' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('own prosecutors office should be visible to prosecutors', () => {
    // Arrange
    const theCase = {
      state: CaseState.NEW,
      prosecutor: { institutionId: 'Prosecutors Office' },
    } as Case
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { id: 'Prosecutors Office' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(false)
  })

  it('other courts should be hidden from registrars', () => {
    // Arrange
    const theCase = {
      state: CaseState.SUBMITTED,
      courtId: 'Court',
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'Another Court' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('own court should be visible to registrars', () => {
    // Arrange
    const theCase = {
      state: CaseState.SUBMITTED,
      courtId: 'Court',
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'Court' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(false)
  })

  it('other courts should be hidden from judges', () => {
    // Arrange
    const theCase = {
      state: CaseState.SUBMITTED,
      courtId: 'Court',
    } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'Another Court' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('own court should be visible to judges', () => {
    // Arrange
    const theCase = {
      state: CaseState.SUBMITTED,
      courtId: 'Court',
    } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'Court' },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

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
        id: 'Prosecutors Office Id',
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
            { prosecutor_id: { [Op.is]: null } },
            {
              '$prosecutor.institution_id$': 'Prosecutors Office Id',
            },
          ],
        },
      ],
    })
  })

  it('should get registrar filter', () => {
    // Arrange
    const user = {
      role: UserRole.REGISTRAR,
      institution: {
        id: 'Court Id',
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        {
          [Op.not]: {
            state: [CaseState.DELETED, CaseState.NEW],
          },
        },
        {
          [Op.or]: [{ court_id: { [Op.is]: null } }, { court_id: 'Court Id' }],
        },
      ],
    })
  })

  it('should get judge filter', () => {
    // Arrange
    const user = {
      role: UserRole.JUDGE,
      institution: {
        id: 'Court Id',
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        {
          [Op.not]: {
            state: [CaseState.DELETED, CaseState.NEW],
          },
        },
        {
          [Op.or]: [{ court_id: { [Op.is]: null } }, { court_id: 'Court Id' }],
        },
      ],
    })
  })
})
