import { Op } from 'sequelize'
import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  courtRoles,
  indictmentCases,
  InstitutionType,
  investigationCases,
  prosecutionRoles,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { randomDate } from '../../../test'
import { Case } from '../models/case.model'
import { getCasesQueryFilter, isCaseBlockedFromUser } from './case.filters'

describe('isCaseBlockedFromUser', () => {
  describe.each([...restrictionCases, investigationCases])(
    'given %s case',
    (caseType) => {
      each`
        state                  | role                       | institutionType
        ${CaseState.DELETED}   | ${UserRole.PROSECUTOR}     | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.DELETED}   | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.DELETED}   | ${UserRole.REGISTRAR}      | ${InstitutionType.Court}
        ${CaseState.DELETED}   | ${UserRole.JUDGE}          | ${InstitutionType.Court}
        ${CaseState.DELETED}   | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.DELETED}   | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.DELETED}   | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.DELETED}   | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
        ${CaseState.DELETED}   | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.DELETED}   | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.NEW}       | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.NEW}       | ${UserRole.REGISTRAR}      | ${InstitutionType.Court}
        ${CaseState.NEW}       | ${UserRole.JUDGE}          | ${InstitutionType.Court}
        ${CaseState.NEW}       | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.NEW}       | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.NEW}       | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
        ${CaseState.NEW}       | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.NEW}       | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.DRAFT}     | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.DRAFT}     | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
        ${CaseState.DRAFT}     | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.DRAFT}     | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.SUBMITTED} | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.SUBMITTED} | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.SUBMITTED} | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
        ${CaseState.SUBMITTED} | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.SUBMITTED} | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.RECEIVED}  | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.RECEIVED}  | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
        ${CaseState.RECEIVED}  | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
        ${CaseState.RECEIVED}  | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.RECEIVED}  | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.REJECTED}  | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.REJECTED}  | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.REJECTED}  | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.REJECTED}  | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.ACCEPTED}  | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.ACCEPTED}  | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.DISMISSED} | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.DISMISSED} | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
        ${CaseState.DISMISSED} | ${UserRole.STAFF}          | ${InstitutionType.Prison}
        ${CaseState.DISMISSED} | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      `.it(
        'should block $state $caseType case from $role at $institutionType',
        ({ state, role, institutionType }) => {
          // Arrange
          const theCase = { state, type: caseType } as Case
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
    },
  )

  describe.each(indictmentCases)('given %s case', (caseType) => {
    each`
      state                  | role                       | institutionType
      ${CaseState.DELETED}   | ${UserRole.PROSECUTOR}     | ${InstitutionType.ProsecutorsOffice}
      ${CaseState.DELETED}   | ${UserRole.REPRESENTATIVE} | ${InstitutionType.ProsecutorsOffice}
      ${CaseState.DELETED}   | ${UserRole.REGISTRAR}      | ${InstitutionType.Court}
      ${CaseState.DELETED}   | ${UserRole.JUDGE}          | ${InstitutionType.Court}
      ${CaseState.DELETED}   | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
      ${CaseState.DELETED}   | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
      ${CaseState.DELETED}   | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
      ${CaseState.DELETED}   | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.DELETED}   | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.NEW}       | ${UserRole.REGISTRAR}      | ${InstitutionType.Court}
      ${CaseState.NEW}       | ${UserRole.JUDGE}          | ${InstitutionType.Court}
      ${CaseState.NEW}       | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
      ${CaseState.NEW}       | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
      ${CaseState.NEW}       | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
      ${CaseState.NEW}       | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.NEW}       | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}      | ${InstitutionType.Court}
      ${CaseState.DRAFT}     | ${UserRole.JUDGE}          | ${InstitutionType.Court}
      ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}      | ${InstitutionType.Court}
      ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
      ${CaseState.DRAFT}     | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
      ${CaseState.DRAFT}     | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.DRAFT}     | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
      ${CaseState.SUBMITTED} | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
      ${CaseState.SUBMITTED} | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.SUBMITTED} | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}      | ${InstitutionType.HighCourt}
      ${CaseState.RECEIVED}  | ${UserRole.JUDGE}          | ${InstitutionType.HighCourt}
      ${CaseState.RECEIVED}  | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.RECEIVED}  | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.REJECTED}  | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.REJECTED}  | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.ACCEPTED}  | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.ACCEPTED}  | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.DISMISSED} | ${UserRole.STAFF}          | ${InstitutionType.Prison}
      ${CaseState.DISMISSED} | ${UserRole.STAFF}          | ${InstitutionType.PrisonAdmin}
    `.it(
      'should block $state $caseType case from $role at $institutionType',
      ({ state, role, institutionType }) => {
        // Arrange
        const theCase = { state, type: caseType } as Case
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
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'geven %s case',
    (type) => {
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
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
          } as Case
          const user = {
            role: UserRole.PROSECUTOR,
            institution: {
              id: 'Another Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
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
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
          } as Case
          const user = {
            role: UserRole.PROSECUTOR,
            institution: {
              id: 'Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
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
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
            sharedWithProsecutorsOfficeId: 'Another Prosecutors Office',
          } as Case
          const user = {
            role: UserRole.PROSECUTOR,
            institution: {
              id: 'Another Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
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
            type,
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
              type: InstitutionType.ProsecutorsOffice,
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
            type,
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
              type: InstitutionType.ProsecutorsOffice,
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
            type,
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
              type: InstitutionType.ProsecutorsOffice,
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
            type,
            courtId: 'Court',
          } as Case
          const user = {
            role,
            institution: { id: 'Another Court', type: InstitutionType.Court },
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
            type,
            courtId: 'Court',
          } as Case
          const user = {
            role,
            institution: { id: 'Court', type: InstitutionType.Court },
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
            type,
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
            institution: { id: 'Court', type: InstitutionType.Court },
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
              type,
              courtId: 'Court',
              accusedAppealDecision: CaseAppealDecision.APPEAL,
            } as Case
            const user = {
              role,
              institution: {
                id: 'High Court',
                type: InstitutionType.HighCourt,
              },
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
              type,
              courtId: 'Court',
              prosecutorAppealDecision: CaseAppealDecision.APPEAL,
            } as Case
            const user = {
              role,
              institution: {
                id: 'High Court',
                type: InstitutionType.HighCourt,
              },
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
              type,
              courtId: 'Court',
              accusedAppealDecision: CaseAppealDecision.POSTPONE,
              accusedPostponedAppealDate: randomDate(),
            } as Case
            const user = {
              role,
              institution: {
                id: 'High Court',
                type: InstitutionType.HighCourt,
              },
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
              type,
              courtId: 'Court',
              prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
              prosecutorPostponedAppealDate: randomDate(),
            } as Case
            const user = {
              role,
              institution: {
                id: 'High Court',
                type: InstitutionType.HighCourt,
              },
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
                type,
                courtId: 'Court',
                accusedAppealDecision,
                prosecutorAppealDecision,
              } as Case
              const user = {
                role,
                institution: {
                  id: 'High Court',
                  type: InstitutionType.HighCourt,
                },
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
    },
  )

  describe.each(indictmentCases)('geven %s case', (type) => {
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
      it.each(prosecutionRoles)(
        'should block the case from other prosecutors offices',
        (role) => {
          // Arrange
          const theCase = {
            state,
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
          } as Case
          const user = {
            role,
            institution: {
              id: 'Another Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
            },
          } as User

          // Act
          const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
          const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        },
      )

      it.each(prosecutionRoles)(
        'should not block the case from own prosecutors office',
        (role) => {
          // Arrange
          const theCase = {
            state,
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
          } as Case
          const user = {
            role,
            institution: {
              id: 'Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
            },
          } as User

          // Act
          const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
          const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(false)
          expect(isReadBlocked).toBe(false)
        },
      )

      it.each(prosecutionRoles)(
        'should not read block the case from shared prosecutors office',
        (role) => {
          // Arrange
          const theCase = {
            state,
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
            sharedWithProsecutorsOfficeId: 'Another Prosecutors Office',
          } as Case
          const user = {
            role,
            institution: {
              id: 'Another Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
            },
          } as User

          // Act
          const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
          const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(false)
        },
      )

      it.each(prosecutionRoles)(
        'should block a hightened security case from other prosecutors',
        (role) => {
          // Arrange
          const theCase = {
            state,
            type,
            isHeightenedSecurityLevel: true,
            creatingProsecutor: {
              id: 'Creating Prosecutor',
              institution: { id: 'Prosecutors Office' },
            },
            prosecutor: { id: 'Assigned Prosecutor' },
          } as Case
          const user = {
            id: 'Other Prosecutor',
            role,
            institution: {
              id: 'Prosecutors Office',
              type: InstitutionType.ProsecutorsOffice,
            },
          } as User

          // Act
          const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
          const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        },
      )

      it('should not block a hightened security case from creating prosecutor', () => {
        // Arrange
        const theCase = {
          state,
          type,
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
            type: InstitutionType.ProsecutorsOffice,
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
          type,
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
            type: InstitutionType.ProsecutorsOffice,
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
        ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}
        ${CaseState.SUBMITTED} | ${UserRole.JUDGE}
        ${CaseState.SUBMITTED} | ${UserRole.ASSISTANT}
        ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}
        ${CaseState.RECEIVED}  | ${UserRole.JUDGE}
        ${CaseState.RECEIVED}  | ${UserRole.ASSISTANT}
        ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
        ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
        ${CaseState.ACCEPTED}  | ${UserRole.ASSISTANT}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}
        ${CaseState.REJECTED}  | ${UserRole.ASSISTANT}
        ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
        ${CaseState.DISMISSED} | ${UserRole.JUDGE}
        ${CaseState.DISMISSED} | ${UserRole.ASSISTANT}
      `.describe('given $state case and $role role', ({ state, role }) => {
      it('should block the case from the role at other courts', () => {
        // Arrange
        const theCase = {
          state,
          type,
          courtId: 'Court',
        } as Case
        const user = {
          role,
          institution: { id: 'Another Court', type: InstitutionType.Court },
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
          type,
          courtId: 'Court',
        } as Case
        const user = {
          role,
          institution: { id: 'Court', type: InstitutionType.Court },
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
          type,
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
          institution: { id: 'Court', type: InstitutionType.Court },
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
            type,
            courtId: 'Court',
            accusedAppealDecision: CaseAppealDecision.APPEAL,
          } as Case
          const user = {
            role,
            institution: {
              id: 'High Court',
              type: InstitutionType.HighCourt,
            },
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
            type,
            courtId: 'Court',
            prosecutorAppealDecision: CaseAppealDecision.APPEAL,
          } as Case
          const user = {
            role,
            institution: {
              id: 'High Court',
              type: InstitutionType.HighCourt,
            },
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
            type,
            courtId: 'Court',
            accusedAppealDecision: CaseAppealDecision.POSTPONE,
            accusedPostponedAppealDate: randomDate(),
          } as Case
          const user = {
            role,
            institution: {
              id: 'High Court',
              type: InstitutionType.HighCourt,
            },
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
            type,
            courtId: 'Court',
            prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
            prosecutorPostponedAppealDate: randomDate(),
          } as Case
          const user = {
            role,
            institution: {
              id: 'High Court',
              type: InstitutionType.HighCourt,
            },
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
              type,
              courtId: 'Court',
              accusedAppealDecision,
              prosecutorAppealDecision,
            } as Case
            const user = {
              role,
              institution: {
                id: 'High Court',
                type: InstitutionType.HighCourt,
              },
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

  describe.each(investigationCases)('given an accepted %s case', (type) => {
    each`
      institutionType
      ${InstitutionType.Prison}
      ${InstitutionType.PrisonAdmin}
    `.it(
      'it should block the case from staff at $institutionType',
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

  it('should block an accepted travel ban case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.Prison },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(true)
  })

  it('should not read block an accepted travel ban case from prison admin staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PrisonAdmin },
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
      institution: { type: InstitutionType.Prison },
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
      institution: { type: InstitutionType.Prison },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block an accepted admission to facility case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.Prison },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block a partially accepted custody case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING_PARTIALLY,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.Prison },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block a partially accepted admission to facility case from prison staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
      decision: CaseDecision.ACCEPTING_PARTIALLY,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.Prison },
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
      institution: { type: InstitutionType.PrisonAdmin },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(false)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block an accepted admission to facility case from prison admin staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.STAFF,
      institution: { type: InstitutionType.PrisonAdmin },
    } as User

    // Act
    const isWriteBlocked = isCaseBlockedFromUser(theCase, user)
    const isReadBlocked = isCaseBlockedFromUser(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(false)
    expect(isReadBlocked).toBe(false)
  })

  describe.each([...restrictionCases, ...investigationCases, indictmentCases])(
    'given %s case',
    (type) => {
      it.each(Object.values(CaseState))(
        'should block admin from reading or writing %s state',
        (state) => {
          // Arrange
          const theCase = { type, state } as Case
          const user = { role: UserRole.ADMIN } as User

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
      id: 'Prosecutor Id',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.ProsecutorsOffice,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        { [Op.not]: { state: [CaseState.DELETED] } },
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

  it('should get representative filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
      role: UserRole.REPRESENTATIVE,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.ProsecutorsOffice,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        { [Op.not]: { state: [CaseState.DELETED] } },
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
            { creating_prosecutor_id: user.id },
            { prosecutor_id: user.id },
          ],
        },
        { type: indictmentCases },
      ],
    })
  })

  describe.each(courtRoles)('given $role role', (role) => {
    it(`should get ${role} filter`, () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'Court Id', type: InstitutionType.Court },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { isArchived: false },
          { [Op.not]: { state: [CaseState.NEW, CaseState.DELETED] } },
          {
            [Op.or]: [
              { court_id: { [Op.is]: null } },
              { court_id: 'Court Id' },
            ],
          },
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.DRAFT }, { type: indictmentCases }],
            },
          },
        ],
      })
    })

    it('should get high court filter', () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'High Court Id', type: InstitutionType.HighCourt },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { isArchived: false },
          {
            [Op.not]: {
              state: [
                CaseState.NEW,
                CaseState.DRAFT,
                CaseState.SUBMITTED,
                CaseState.RECEIVED,
                CaseState.DELETED,
              ],
            },
          },
          {
            [Op.or]: [
              { accused_appeal_decision: CaseAppealDecision.APPEAL },
              { prosecutor_appeal_decision: CaseAppealDecision.APPEAL },
              { accused_postponed_appeal_date: { [Op.not]: null } },
              { prosecutor_postponed_appeal_date: { [Op.not]: null } },
            ],
          },
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.DRAFT }, { type: indictmentCases }],
            },
          },
        ],
      })
    })
  })

  it(`should get assistant filter`, () => {
    // Arrange
    const user = {
      role: UserRole.ASSISTANT,
      institution: { id: 'Court Id', type: InstitutionType.Court },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        {
          [Op.not]: {
            state: [CaseState.NEW, CaseState.DRAFT, CaseState.DELETED],
          },
        },
        {
          [Op.or]: [{ court_id: { [Op.is]: null } }, { court_id: 'Court Id' }],
        },
        { type: indictmentCases },
      ],
    })
  })

  it('should get prison staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.Prison,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        { state: CaseState.ACCEPTED },
        { type: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY] },
        {
          decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
        },
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
        type: InstitutionType.PrisonAdmin,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        { state: CaseState.ACCEPTED },
        {
          type: [
            CaseType.ADMISSION_TO_FACILITY,
            CaseType.CUSTODY,
            CaseType.TRAVEL_BAN,
          ],
        },
      ],
    })
  })
})
