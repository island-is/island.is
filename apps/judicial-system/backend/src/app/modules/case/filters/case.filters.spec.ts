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
        ${CaseState.Deleted}   | ${UserRole.Prosecutor}     | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Deleted}   | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Deleted}   | ${UserRole.Registrar}      | ${InstitutionType.Court}
        ${CaseState.Deleted}   | ${UserRole.Judge}          | ${InstitutionType.Court}
        ${CaseState.Deleted}   | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Deleted}   | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.Deleted}   | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.Deleted}   | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
        ${CaseState.Deleted}   | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Deleted}   | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.New}       | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.New}       | ${UserRole.Registrar}      | ${InstitutionType.Court}
        ${CaseState.New}       | ${UserRole.Judge}          | ${InstitutionType.Court}
        ${CaseState.New}       | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.New}       | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.New}       | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
        ${CaseState.New}       | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.New}       | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.Draft}     | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Draft}     | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Draft}     | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.Draft}     | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
        ${CaseState.Draft}     | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Draft}     | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.Submitted} | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Submitted} | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Submitted} | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.Submitted} | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
        ${CaseState.Submitted} | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Submitted} | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.Received}  | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Received}  | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Received}  | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
        ${CaseState.Received}  | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
        ${CaseState.Received}  | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Received}  | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.Rejected}  | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Rejected}  | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Rejected}  | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Rejected}  | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
        ${CaseState.Accepted}  | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Accepted}  | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Dismissed} | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
        ${CaseState.Dismissed} | ${UserRole.Assistant}      | ${InstitutionType.Court}
        ${CaseState.Dismissed} | ${UserRole.Staff}          | ${InstitutionType.Prison}
        ${CaseState.Dismissed} | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
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
      ${CaseState.Deleted}   | ${UserRole.Prosecutor}     | ${InstitutionType.ProsecutorsOffice}
      ${CaseState.Deleted}   | ${UserRole.Representative} | ${InstitutionType.ProsecutorsOffice}
      ${CaseState.Deleted}   | ${UserRole.Registrar}      | ${InstitutionType.Court}
      ${CaseState.Deleted}   | ${UserRole.Judge}          | ${InstitutionType.Court}
      ${CaseState.Deleted}   | ${UserRole.Assistant}      | ${InstitutionType.Court}
      ${CaseState.Deleted}   | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
      ${CaseState.Deleted}   | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
      ${CaseState.Deleted}   | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Deleted}   | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.New}       | ${UserRole.Registrar}      | ${InstitutionType.Court}
      ${CaseState.New}       | ${UserRole.Judge}          | ${InstitutionType.Court}
      ${CaseState.New}       | ${UserRole.Assistant}      | ${InstitutionType.Court}
      ${CaseState.New}       | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
      ${CaseState.New}       | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
      ${CaseState.New}       | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.New}       | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Draft}     | ${UserRole.Registrar}      | ${InstitutionType.Court}
      ${CaseState.Draft}     | ${UserRole.Judge}          | ${InstitutionType.Court}
      ${CaseState.Draft}     | ${UserRole.Assistant}      | ${InstitutionType.Court}
      ${CaseState.Draft}     | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
      ${CaseState.Draft}     | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
      ${CaseState.Draft}     | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Draft}     | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Submitted} | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
      ${CaseState.Submitted} | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
      ${CaseState.Submitted} | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Submitted} | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Received}  | ${UserRole.Registrar}      | ${InstitutionType.HighCourt}
      ${CaseState.Received}  | ${UserRole.Judge}          | ${InstitutionType.HighCourt}
      ${CaseState.Received}  | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Received}  | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Rejected}  | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Rejected}  | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Accepted}  | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Accepted}  | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
      ${CaseState.Dismissed} | ${UserRole.Staff}          | ${InstitutionType.Prison}
      ${CaseState.Dismissed} | ${UserRole.Staff}          | ${InstitutionType.PrisonAdmin}
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
        ${CaseState.New}
        ${CaseState.Draft}
        ${CaseState.Submitted}
        ${CaseState.Received}
        ${CaseState.Accepted}
        ${CaseState.Rejected}
        ${CaseState.Dismissed}
      `.describe('given $state case', ({ state }) => {
        it('should block the case from other prosecutors offices', () => {
          // Arrange
          const theCase = {
            state,
            type,
            creatingProsecutor: { institutionId: 'Prosecutors Office' },
          } as Case
          const user = {
            role: UserRole.Prosecutor,
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
            role: UserRole.Prosecutor,
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
            role: UserRole.Prosecutor,
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
            role: UserRole.Prosecutor,
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
            role: UserRole.Prosecutor,
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
            role: UserRole.Prosecutor,
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
        ${CaseState.Draft}     | ${UserRole.Registrar}
        ${CaseState.Draft}     | ${UserRole.Judge}
        ${CaseState.Submitted} | ${UserRole.Registrar}
        ${CaseState.Submitted} | ${UserRole.Judge}
        ${CaseState.Received}  | ${UserRole.Registrar}
        ${CaseState.Received}  | ${UserRole.Judge}
        ${CaseState.Accepted}  | ${UserRole.Registrar}
        ${CaseState.Accepted}  | ${UserRole.Judge}
        ${CaseState.Rejected}  | ${UserRole.Registrar}
        ${CaseState.Rejected}  | ${UserRole.Judge}
        ${CaseState.Dismissed} | ${UserRole.Registrar}
        ${CaseState.Dismissed} | ${UserRole.Judge}
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
        ${CaseState.Accepted}  | ${UserRole.Registrar}
        ${CaseState.Accepted}  | ${UserRole.Judge}
        ${CaseState.Rejected}  | ${UserRole.Registrar}
        ${CaseState.Rejected}  | ${UserRole.Judge}
        ${CaseState.Dismissed} | ${UserRole.Registrar}
        ${CaseState.Dismissed} | ${UserRole.Judge}
      `.describe(
        'given a $state case and $role at high court',
        ({ state, role }) => {
          it('should not read block the case if the accused appealed in court', () => {
            // Arrange
            const theCase = {
              state,
              type,
              courtId: 'Court',
              accusedAppealDecision: CaseAppealDecision.Appeal,
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
              prosecutorAppealDecision: CaseAppealDecision.Appeal,
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
              accusedAppealDecision: CaseAppealDecision.Postpone,
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
              prosecutorAppealDecision: CaseAppealDecision.Postpone,
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
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.Postpone}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.Postpone}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.Postpone}
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
        ${CaseState.New}
        ${CaseState.Draft}
        ${CaseState.Submitted}
        ${CaseState.Received}
        ${CaseState.Accepted}
        ${CaseState.Rejected}
        ${CaseState.Dismissed}
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
          role: UserRole.Prosecutor,
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
          role: UserRole.Prosecutor,
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
        ${CaseState.Submitted} | ${UserRole.Registrar}
        ${CaseState.Submitted} | ${UserRole.Judge}
        ${CaseState.Submitted} | ${UserRole.Assistant}
        ${CaseState.Received}  | ${UserRole.Registrar}
        ${CaseState.Received}  | ${UserRole.Judge}
        ${CaseState.Received}  | ${UserRole.Assistant}
        ${CaseState.Accepted}  | ${UserRole.Registrar}
        ${CaseState.Accepted}  | ${UserRole.Judge}
        ${CaseState.Accepted}  | ${UserRole.Assistant}
        ${CaseState.Rejected}  | ${UserRole.Registrar}
        ${CaseState.Rejected}  | ${UserRole.Judge}
        ${CaseState.Rejected}  | ${UserRole.Assistant}
        ${CaseState.Dismissed} | ${UserRole.Registrar}
        ${CaseState.Dismissed} | ${UserRole.Judge}
        ${CaseState.Dismissed} | ${UserRole.Assistant}
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
        ${CaseState.Accepted}  | ${UserRole.Registrar}
        ${CaseState.Accepted}  | ${UserRole.Judge}
        ${CaseState.Rejected}  | ${UserRole.Registrar}
        ${CaseState.Rejected}  | ${UserRole.Judge}
        ${CaseState.Dismissed} | ${UserRole.Registrar}
        ${CaseState.Dismissed} | ${UserRole.Judge}
      `.describe(
      'given a $state case and $role at high court',
      ({ state, role }) => {
        it('should not read block the case if the accused appealed in court', () => {
          // Arrange
          const theCase = {
            state,
            type,
            courtId: 'Court',
            accusedAppealDecision: CaseAppealDecision.Appeal,
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
            prosecutorAppealDecision: CaseAppealDecision.Appeal,
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
            accusedAppealDecision: CaseAppealDecision.Postpone,
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
            prosecutorAppealDecision: CaseAppealDecision.Postpone,
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
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.Accept}          | ${CaseAppealDecision.Postpone}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.NotApplicable}  | ${CaseAppealDecision.Postpone}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.Accept}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.NotApplicable}
            ${CaseAppealDecision.Postpone}        | ${CaseAppealDecision.Postpone}
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
          state: CaseState.Accepted,
        } as Case
        const user = {
          role: UserRole.Staff,
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
      type: CaseType.TravelBan,
      state: CaseState.Accepted,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.TravelBan,
      state: CaseState.Accepted,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.Custody,
      state: CaseState.Accepted,
      decision: CaseDecision.AcceptingAlternativeTravelBan,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.Custody,
      state: CaseState.Accepted,
      decision: CaseDecision.Accepting,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.AdmissionToFacility,
      state: CaseState.Accepted,
      decision: CaseDecision.Accepting,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.Custody,
      state: CaseState.Accepted,
      decision: CaseDecision.AcceptingPartially,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.AdmissionToFacility,
      state: CaseState.Accepted,
      decision: CaseDecision.AcceptingPartially,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.Custody,
      state: CaseState.Accepted,
    } as Case
    const user = {
      role: UserRole.Staff,
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
      type: CaseType.AdmissionToFacility,
      state: CaseState.Accepted,
    } as Case
    const user = {
      role: UserRole.Staff,
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
          const user = { role: UserRole.Admin } as User

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
      role: UserRole.Prosecutor,
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
        { [Op.not]: { state: [CaseState.Deleted] } },
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
      role: UserRole.Representative,
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
        { [Op.not]: { state: [CaseState.Deleted] } },
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
          { [Op.not]: { state: [CaseState.New, CaseState.Deleted] } },
          {
            [Op.or]: [
              { court_id: { [Op.is]: null } },
              { court_id: 'Court Id' },
            ],
          },
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.Draft }, { type: indictmentCases }],
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
                CaseState.New,
                CaseState.Draft,
                CaseState.Submitted,
                CaseState.Received,
                CaseState.Deleted,
              ],
            },
          },
          {
            [Op.or]: [
              { accused_appeal_decision: CaseAppealDecision.Appeal },
              { prosecutor_appeal_decision: CaseAppealDecision.Appeal },
              { accused_postponed_appeal_date: { [Op.not]: null } },
              { prosecutor_postponed_appeal_date: { [Op.not]: null } },
            ],
          },
          {
            [Op.not]: {
              [Op.and]: [{ state: CaseState.Draft }, { type: indictmentCases }],
            },
          },
        ],
      })
    })
  })

  it(`should get assistant filter`, () => {
    // Arrange
    const user = {
      role: UserRole.Assistant,
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
            state: [CaseState.New, CaseState.Draft, CaseState.Deleted],
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
      role: UserRole.Staff,
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
        { state: CaseState.Accepted },
        { type: [CaseType.Custody, CaseType.AdmissionToFacility] },
        {
          decision: [CaseDecision.Accepting, CaseDecision.AcceptingPartially],
        },
      ],
    })
  })

  it('should get prison admin staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.Staff,
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
        { state: CaseState.Accepted },
        {
          type: [
            CaseType.AdmissionToFacility,
            CaseType.Custody,
            CaseType.TravelBan,
          ],
        },
      ],
    })
  })
})
