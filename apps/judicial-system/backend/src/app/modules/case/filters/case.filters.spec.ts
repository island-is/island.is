import { literal, Op } from 'sequelize'
import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseState,
  CaseType,
  InstitutionType,
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
    ${CaseState.NEW}       | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
    ${CaseState.NEW}       | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
    ${CaseState.NEW}       | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.NEW}       | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.DRAFT}     | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.SUBMITTED} | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
    ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
    ${CaseState.RECEIVED}  | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
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
      const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
      const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

      // Assert
      expect(isWriteBlocked).toBe(true)
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
        ${CaseAppealDecision.ACCEPT}  | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.ACCEPT}  | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.ACCEPT}  | ${CaseAppealDecision.POSTPONE}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.NOT_APPLICABLE}  | ${CaseAppealDecision.POSTPONE}
        ${CaseAppealDecision.POSTPONE}  | ${CaseAppealDecision.ACCEPT}
        ${CaseAppealDecision.POSTPONE}  | ${CaseAppealDecision.NOT_APPLICABLE}
        ${CaseAppealDecision.POSTPONE}  | ${CaseAppealDecision.POSTPONE}
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
              { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
              { state: CaseState.ACCEPTED },
              { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.not]: {
            [Op.and]: [
              { [Op.not]: { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] } },
              { state: CaseState.ACCEPTED },
              { ruling_date: { [Op.lt]: literal('current_date - 90') } },
            ],
          },
        },
        {
          [Op.or]: [
            { prosecutor_id: { [Op.is]: null } },
            { '$prosecutor.institution_id$': 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
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
                { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
                { state: CaseState.ACCEPTED },
                { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { [Op.not]: { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] } },
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
                { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
                { state: CaseState.ACCEPTED },
                { valid_to_date: { [Op.lt]: literal('current_date - 90') } },
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                { [Op.not]: { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] } },
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
})
