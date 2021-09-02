import { Op } from 'sequelize'

import {
  CaseAppealDecision,
  CaseState,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { getCasesQueryFilter, isCaseBlockedFromUser } from './case.filters'
import { Case } from '../models'

describe('isCaseBlockedFromUser', () => {
  it('deleted should be hidden from prosecutors', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = {
      role: UserRole.PROSECUTOR,
      institution: { type: InstitutionType.PROSECUTORS_OFFICE },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('deleted should be hidden from registrars', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { type: InstitutionType.COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('new should be hidden from registrars', () => {
    // Arrange
    const theCase = { state: CaseState.NEW } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { type: InstitutionType.COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('deleted should be hidden from judges', () => {
    // Arrange
    const theCase = { state: CaseState.DELETED } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { type: InstitutionType.COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('new should be hidden from judges', () => {
    // Arrange
    const theCase = { state: CaseState.NEW } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { type: InstitutionType.COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('draft should be hidden from high court registrars', () => {
    // Arrange
    const theCase = { state: CaseState.DRAFT } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('submitted should be hidden from high court registrars', () => {
    // Arrange
    const theCase = { state: CaseState.SUBMITTED } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('received should be hidden from high court registrars', () => {
    // Arrange
    const theCase = { state: CaseState.RECEIVED } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('draft should be hidden from high court judges', () => {
    // Arrange
    const theCase = { state: CaseState.DRAFT } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('submitted should be hidden from high court judges', () => {
    // Arrange
    const theCase = { state: CaseState.SUBMITTED } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('received should be hidden from high court judges', () => {
    // Arrange
    const theCase = { state: CaseState.RECEIVED } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { type: InstitutionType.HIGH_COURT },
    } as User

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
      institution: {
        id: 'Another Prosecutors Office',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
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
      institution: {
        id: 'Prosecutors Office',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(false)
  })

  it('should be possible to share case with other prosecutors office', () => {
    // Arrange
    const theCase = {
      state: CaseState.NEW,
      prosecutor: { institutionId: 'Prosecutors Office' },
      sharedWithProsecutorsOfficeId: 'Another Prosecutors Office',
    } as Case
    const user = {
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Another Prosecutors Office',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(res).toBe(false)
  })

  it('other prosecutors office should not be able to update a shared case ', () => {
    // Arrange
    const theCase = {
      state: CaseState.NEW,
      prosecutor: { institutionId: 'Prosecutors Office' },
      sharedWithProsecutorsOfficeId: 'Another Prosecutors Office',
    } as Case
    const user = {
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Another Prosecutors Office',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('other courts should be hidden from registrars', () => {
    // Arrange
    const theCase = {
      state: CaseState.SUBMITTED,
      courtId: 'Court',
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'Another Court', type: InstitutionType.COURT },
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
      institution: { id: 'Court', type: InstitutionType.COURT },
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
      institution: { id: 'Another Court', type: InstitutionType.COURT },
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
      institution: { id: 'Court', type: InstitutionType.COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(false)
  })

  it('all appealed cases of all courts should be visible to high court registrars', () => {
    // Arrange
    const theCase = {
      state: CaseState.ACCEPTED,
      courtId: 'Court',
      accusedAppealDecision: CaseAppealDecision.APPEAL,
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(res).toBe(false)
  })

  it('all unappealed cases of all courts should be hidden from high court registrars', () => {
    // Arrange
    const theCase = {
      state: CaseState.ACCEPTED,
      courtId: 'Court',
      accusedAppealDecision: CaseAppealDecision.POSTPONE,
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(res).toBe(true)
  })

  it('high court registrars should not be able to update cases', () => {
    // Arrange
    const theCase = {
      state: CaseState.REJECTED,
      courtId: 'Court',
      accusedPostponedAppealDate: new Date(),
    } as Case
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })

  it('all appealed cases of all courts should be visible to high court judges', () => {
    // Arrange
    const theCase = {
      state: CaseState.REJECTED,
      courtId: 'Court',
      prosecutorPostponedAppealDate: new Date(),
    } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(res).toBe(false)
  })

  it('all unappealed cases of all courts should be hidden from high court judges', () => {
    // Arrange
    const theCase = {
      state: CaseState.REJECTED,
      courtId: 'Court',
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
    } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(res).toBe(true)
  })

  it('high court judges should not be able to update cases', () => {
    // Arrange
    const theCase = {
      state: CaseState.ACCEPTED,
      courtId: 'Court',
      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
    } as Case
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
    } as User

    // Act
    const res = isCaseBlockedFromUser(theCase, user)

    // Assert
    expect(res).toBe(true)
  })
})

describe('getCasesQueryFilter', () => {
  it('should get prosecutor filter', () => {
    // Arrange
    const user = {
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.PROSECUTORS_OFFICE,
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
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
          ],
        },
      ],
    })
  })

  it('should get registrar filter', () => {
    // Arrange
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'Court Id', type: InstitutionType.COURT },
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
      institution: { id: 'Court Id', type: InstitutionType.COURT },
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

  it('should get high court registrar filter', () => {
    // Arrange
    const user = {
      role: UserRole.REGISTRAR,
      institution: { id: 'High Court Id', type: InstitutionType.HIGH_COURT },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        {
          [Op.not]: {
            state: [
              CaseState.DELETED,
              CaseState.NEW,
              CaseState.DRAFT,
              CaseState.SUBMITTED,
              CaseState.RECEIVED,
            ],
          },
        },
        {
          [Op.or]: {
            accused_appeal_decision: CaseAppealDecision.APPEAL,
            prosecutor_appeal_decision: CaseAppealDecision.APPEAL,
            accused_postponed_appeal_date: { [Op.not]: null },
            prosecutor_postponed_appeal_date: { [Op.not]: null },
          },
        },
      ],
    })
  })

  it('should get high court judge filter', () => {
    // Arrange
    const user = {
      role: UserRole.JUDGE,
      institution: { id: 'High Court Id', type: InstitutionType.HIGH_COURT },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        {
          [Op.not]: {
            state: [
              CaseState.DELETED,
              CaseState.NEW,
              CaseState.DRAFT,
              CaseState.SUBMITTED,
              CaseState.RECEIVED,
            ],
          },
        },
        {
          [Op.or]: {
            accused_appeal_decision: CaseAppealDecision.APPEAL,
            prosecutor_appeal_decision: CaseAppealDecision.APPEAL,
            accused_postponed_appeal_date: { [Op.not]: null },
            prosecutor_postponed_appeal_date: { [Op.not]: null },
          },
        },
      ],
    })
  })
})
