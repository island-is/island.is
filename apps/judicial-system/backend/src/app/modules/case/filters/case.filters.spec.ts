import { literal, Op } from 'sequelize'
import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { getCasesQueryFilter, isCaseBlockedFromUser } from './case.filters'
import { Case } from '../models'

describe('isCaseBlockedFromUser', () => {
  each`
    state                  | role                   | institutionType
    ${CaseState.DELETED}   | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
    ${CaseState.DELETED}   | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
    ${CaseState.DELETED}   | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
    ${CaseState.DELETED}   | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.DELETED}   | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.DELETED}   | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.DELETED}   | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.NEW}       | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
    ${CaseState.NEW}       | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
    ${CaseState.NEW}       | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.NEW}       | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.NEW}       | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.NEW}       | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.DRAFT}     | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.DRAFT}     | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.DRAFT}     | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.SUBMITTED} | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.SUBMITTED} | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.SUBMITTED} | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.RECEIVED}  | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.RECEIVED}  | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.RECEIVED}  | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.REJECTED}  | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.REJECTED}  | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
    ${CaseState.DISMISSED} | ${UserRole.STAFF}      | ${InstitutionType.PRISON}
    ${CaseState.DISMISSED} | ${UserRole.STAFF}      | ${InstitutionType.PRISON_ADMIN}
  `.it(
    'should block $state case from $role at $institutionType',
    ({ state, role, institutionType }) => {
      // Arrange
      const theCase = { state } as Case
      const user = {
        role,
        institution: { type: institutionType },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
      expect(isReadBlocked).toBe(true)
    },
  )

  each`
    state
    ${CaseState.NEW}
    ${CaseState.DRAFT}
    ${CaseState.SUBMITTED}
    ${CaseState.RECEIVED}
    ${CaseState.ACCEPTED}
    ${CaseState.REJECTED}
    ${CaseState.DISMISSED}
  `.describe('given $state case', ({ state }) => {
    it('should block the case from other prosecutors offices', () => {
      // Arrange
      const theCase = {
        state,
        creatingProsecutor: { institutionId: 'Prosecutors Office' },
      } as Case
      const user = {
        role: UserRole.PROSECUTOR,
        institution: {
          id: 'Another Prosecutors Office',
          type: InstitutionType.PROSECUTORS_OFFICE,
        },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
      expect(isReadBlocked).toBe(true)
    })

    it('should not block the case from own prosecutors office', () => {
      // Arrange
      const theCase = {
        state,
        creatingProsecutor: { institutionId: 'Prosecutors Office' },
      } as Case
      const user = {
        role: UserRole.PROSECUTOR,
        institution: {
          id: 'Prosecutors Office',
          type: InstitutionType.PROSECUTORS_OFFICE,
        },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(false)
      expect(isReadBlocked).toBe(false)
    })

    it('should not read block the case from shared prosecutors office', () => {
      // Arrange
      const theCase = {
        state,
        creatingProsecutor: { institutionId: 'Prosecutors Office' },
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
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
      expect(isReadBlocked).toBe(false)
    })

    it('should block a hightened security case from other prosecutors', () => {
      // Arrange
      const theCase = {
        state,
        isHeightenedSecurityLevel: true,
        creatingProsecutor: {
          id: 'Creating Prosecutor',
          institution: { id: 'Prosecutors Office' },
        },
        prosecutor: { id: 'Assigned Prosecutor' },
      } as Case
      const user = {
        id: 'Other Prosecutor',
        role: UserRole.PROSECUTOR,
        institution: {
          id: 'Prosecutors Office',
          type: InstitutionType.PROSECUTORS_OFFICE,
        },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
      expect(isReadBlocked).toBe(true)
    })

    it('should not block a hightened security case from creating prosecutor', () => {
      // Arrange
      const theCase = {
        state,
        isHeightenedSecurityLevel: true,
        creatingProsecutor: {
          id: 'Creating Prosecutor',
          institution: { id: 'Prosecutors Office' },
        },
        prosecutor: { id: 'Assigned Prosecutor' },
      } as Case
      const user = {
        id: 'Creating Prosecutor',
        role: UserRole.PROSECUTOR,
        institution: {
          id: 'Prosecutors Office',
          type: InstitutionType.PROSECUTORS_OFFICE,
        },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(false)
      expect(isReadBlocked).toBe(false)
    })

    it('should not block a hightened security case from assigned prosecutor', () => {
      // Arrange
      const theCase = {
        state,
        isHeightenedSecurityLevel: true,
        creatingProsecutor: {
          id: 'Creating Prosecutor',
          institution: { id: 'Prosecutors Office' },
        },
        prosecutor: { id: 'Assigned Prosecutor' },
      } as Case
      const user = {
        id: 'Assigned Prosecutor',
        role: UserRole.PROSECUTOR,
        institution: {
          id: 'Prosecutors Office',
          type: InstitutionType.PROSECUTORS_OFFICE,
        },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(false)
      expect(isReadBlocked).toBe(false)
    })
  })

  each`
    state                  | role
    ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}
    ${CaseState.DRAFT}     | ${UserRole.JUDGE}
    ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}
    ${CaseState.SUBMITTED} | ${UserRole.JUDGE}
    ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}
    ${CaseState.RECEIVED}  | ${UserRole.JUDGE}
    ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
    ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
    ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
    ${CaseState.REJECTED}  | ${UserRole.JUDGE}
    ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
    ${CaseState.DISMISSED} | ${UserRole.JUDGE}
  `.describe('given $state case and $role role', ({ state, role }) => {
    it('should block the case from the role at other courts', () => {
      // Arrange
      const theCase = {
        state,
        courtId: 'Court',
      } as Case
      const user = {
        role,
        institution: { id: 'Another Court', type: InstitutionType.COURT },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
      expect(isReadBlocked).toBe(true)
    })

    it('should not block the case from the role at own court', () => {
      // Arrange
      const theCase = {
        state,
        courtId: 'Court',
      } as Case
      const user = {
        role,
        institution: { id: 'Court', type: InstitutionType.COURT },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(false)
      expect(isReadBlocked).toBe(false)
    })

    it('should not block a hightened security case from own court', () => {
      // Arrange
      const theCase = {
        state,
        isHeightenedSecurityLevel: true,
        courtId: 'Court',
        creatingProsecutor: {
          id: 'Creating Prosecutor',
          institution: { id: 'Prosecutors Office' },
        },
        prosecutor: { id: 'Assigned Prosecutor' },
      } as Case
      const user = {
        id: 'Court User',
        role,
        institution: { id: 'Court', type: InstitutionType.COURT },
      } as User

      // Act
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(false)
      expect(isReadBlocked).toBe(false)
    })
  })

  each`
    state                  | role
    ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
    ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
    ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
    ${CaseState.REJECTED}  | ${UserRole.JUDGE}
    ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
    ${CaseState.DISMISSED} | ${UserRole.JUDGE}
  `.describe(
    'given a $state case and $role at high court',
    ({ state, role }) => {
      it('should not read block the case if the accused appealed in court', () => {
        // Arrange
        const theCase = {
          state,
          courtId: 'Court',
          accusedAppealDecision: CaseAppealDecision.APPEAL,
        } as Case
        const user = {
          role,
          institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
        } as User

        // Act
        const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
        const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(false)
      })

      it('should not read block the case if the prosecutor appealed in court', () => {
        // Arrange
        const theCase = {
          state,
          courtId: 'Court',
          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
        } as Case
        const user = {
          role,
          institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
        } as User

        // Act
        const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
        const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(false)
      })

      it('should not read block the case if the accused appealed out of court', () => {
        // Arrange
        const theCase = {
          state,
          courtId: 'Court',
          accusedAppealDecision: CaseAppealDecision.POSTPONE,
          accusedPostponedAppealDate: new Date(),
        } as Case
        const user = {
          role,
          institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
        } as User

        // Act
        const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
        const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(false)
      })

      it('should not read block the case if the prosecutor appealed out of court', () => {
        // Arrange
        const theCase = {
          state,
          courtId: 'Court',
          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
          prosecutorPostponedAppealDate: new Date(),
        } as Case
        const user = {
          role,
          institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
        } as User

        // Act
        const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
        const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(false)
      })

      each`
        accusedAppealDecision  | prosecutorAppealDecision
        ${CaseAppealDecision.ACCEPT}          | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.ACCEPT}          | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.ACCEPT}          | ${CaseAppealDecision.POSTPONE}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.POSTPONE}
        ${CaseAppealDecision.POSTPONE}        | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.POSTPONE}        | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.POSTPONE}        | ${CaseAppealDecision.POSTPONE}
      `.it(
        'should block the case if it has not been appealed',
        ({ accusedAppealDecision, prosecutorAppealDecision }) => {
          // Arrange
          const theCase = {
            state,
            courtId: 'Court',
            accusedAppealDecision,
            prosecutorAppealDecision,
          } as Case
          const user = {
            role,
            institution: { id: 'High Court', type: InstitutionType.HIGH_COURT },
          } as User

          // Act
          const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
          const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        },
      )
    },
  )

  each`
    type
    ${CaseType.SEARCH_WARRANT}
    ${CaseType.BANKING_SECRECY_WAIVER}
    ${CaseType.PHONE_TAPPING}
    ${CaseType.TELECOMMUNICATIONS}
    ${CaseType.TRACKING_EQUIPMENT}
    ${CaseType.PSYCHIATRIC_EXAMINATION}
    ${CaseType.SOUND_RECORDING_EQUIPMENT}
    ${CaseType.AUTOPSY}
    ${CaseType.BODY_SEARCH}
    ${CaseType.INTERNET_USAGE}
    ${CaseType.RESTRAINING_ORDER}
    ${CaseType.OTHER}
  `.describe('given an accepted $type case', ({ type }) => {
    each`
      institutionType
      ${InstitutionType.PRISON}
      ${InstitutionType.PRISON_ADMIN}
    `.it(
      'it should block the case from staff at $institution',
      ({ institutionType }) => {
        // Arrange
        const theCase = {
          type,
          state: CaseState.ACCEPTED,
        } as Case
        const user = {
          role: UserRole.STAFF,
          institution: { type: institutionType },
        } as User

        // Act
        const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
        const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(true)
      },
    )
  })

  it('it should block an accepted travel ban case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(true)
  })

  it('it should not read block an accepted travel ban case from prison admin staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should block an accepted custody case with travel ban ruling from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(true)
  })

  it('should not read block an accepted custody case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block an accepted custody case from prison admin staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })
})

describe('getCasesQueryFilter', () => {
  it('should get prosecutor filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
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
        { [Op.not]: { state: [CaseState.DELETED] } },
        {
          [Op.not]: {
            [Op.and]: [
              { state: [CaseState.REJECTED, CaseState.DISMISSED] },
              { ruling_date: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.not]: {
            [Op.and]: [
              {
                state: [
                  CaseState.NEW,
                  CaseState.DRAFT,
                  CaseState.SUBMITTED,
                  CaseState.RECEIVED,
                ],
              },
              { created: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.not]: {
            [Op.and]: [
              { type: restrictionCases },
              { state: CaseState.ACCEPTED },
              { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.not]: {
            [Op.and]: [
              { [Op.not]: { type: restrictionCases } },
              { state: CaseState.ACCEPTED },
              { ruling_date: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.or]: [
            { creating_prosecutor_id: { [Op.is]: null } },
            { '$creatingProsecutor.institution_id$': 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
          ],
        },
        {
          [Op.or]: [
            { is_heightened_security_level: { [Op.is]: null } },
            { is_heightened_security_level: false },
            { creating_prosecutor_id: 'Prosecutor Id' },
            { prosecutor_id: 'Prosecutor Id' },
          ],
        },
      ],
    })
  })

  each`
    role
    ${UserRole.REGISTRAR}
    ${UserRole.JUDGE}
  `.describe('given $role role', ({ role }) => {
    it(`should get ${role} filter for`, () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'Court Id', type: InstitutionType.COURT },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { [Op.not]: { state: [CaseState.DELETED, CaseState.NEW] } },
          {
            [Op.not]: {
              [Op.and]: [
                { state: [CaseState.REJECTED, CaseState.DISMISSED] },
                { ruling_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                {
                  state: [
                    CaseState.NEW,
                    CaseState.DRAFT,
                    CaseState.SUBMITTED,
                    CaseState.RECEIVED,
                  ],
                },
                { created: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { type: restrictionCases },
                { state: CaseState.ACCEPTED },
                { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { [Op.not]: { type: restrictionCases } },
                { state: CaseState.ACCEPTED },
                { ruling_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.or]: [
              { court_id: { [Op.is]: null } },
              { court_id: 'Court Id' },
            ],
          },
        ],
      })
    })

    it('should get high court filter', () => {
      // Arrange
      const user = {
        role,
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
            [Op.not]: {
              [Op.and]: [
                { state: [CaseState.REJECTED, CaseState.DISMISSED] },
                { ruling_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                {
                  state: [
                    CaseState.NEW,
                    CaseState.DRAFT,
                    CaseState.SUBMITTED,
                    CaseState.RECEIVED,
                  ],
                },
                { created: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { type: restrictionCases },
                { state: CaseState.ACCEPTED },
                { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { [Op.not]: { type: restrictionCases } },
                { state: CaseState.ACCEPTED },
                { ruling_date: { [Op.lt]: literal('current_date - 90') } },
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

  it('should get prison staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.PRISON,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { state: CaseState.ACCEPTED },
        { type: CaseType.CUSTODY },
        { decision: CaseDecision.ACCEPTING },
        { valid_to_date: { [Op.gt]: literal('current_date - 90') } },
      ],
    })
  })

  it('should get prison admin staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.PRISON_ADMIN,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { state: CaseState.ACCEPTED },
        { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
        { valid_to_date: { [Op.gt]: literal('current_date - 90') } },
      ],
    })
  })
})
