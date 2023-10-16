import each from 'jest-each'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  prosecutionRoles,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { randomDate } from '../../../test'
import { Case } from '../models/case.model'
import { canUserAccessCase } from './case.filter'

describe('canUserAccessCase', () => {
  describe.each([...restrictionCases, investigationCases])(
    'given %s case',
    (caseType) => {
      each`
        state                  | role                                  | institutionType
        ${CaseState.DELETED}   | ${UserRole.PROSECUTOR}                | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DELETED}   | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DELETED}   | ${UserRole.REGISTRAR}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DELETED}   | ${UserRole.JUDGE}                     | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DELETED}   | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DELETED}   | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DELETED}   | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DELETED}   | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DELETED}   | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.DELETED}   | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.NEW}       | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.NEW}       | ${UserRole.REGISTRAR}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.NEW}       | ${UserRole.JUDGE}                     | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.NEW}       | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.NEW}       | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.NEW}       | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.NEW}       | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.NEW}       | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.NEW}       | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.DRAFT}     | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DRAFT}     | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.DRAFT}     | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.DRAFT}     | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.SUBMITTED} | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.SUBMITTED} | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.SUBMITTED} | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.SUBMITTED} | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.SUBMITTED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.SUBMITTED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.RECEIVED}  | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.RECEIVED}  | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.RECEIVED}  | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.RECEIVED}  | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
        ${CaseState.RECEIVED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.RECEIVED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.REJECTED}  | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.REJECTED}  | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.REJECTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.REJECTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
        ${CaseState.ACCEPTED}  | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.ACCEPTED}  | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DISMISSED} | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DISMISSED} | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
        ${CaseState.DISMISSED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
        ${CaseState.DISMISSED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
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
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        },
      )
    },
  )

  describe.each(indictmentCases)('given %s case', (caseType) => {
    each`
      state                  | role                                  | institutionType
      ${CaseState.DELETED}   | ${UserRole.PROSECUTOR}                | ${InstitutionType.PROSECUTORS_OFFICE}
      ${CaseState.DELETED}   | ${UserRole.PROSECUTOR_REPRESENTATIVE} | ${InstitutionType.PROSECUTORS_OFFICE}
      ${CaseState.DELETED}   | ${UserRole.REGISTRAR}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DELETED}   | ${UserRole.JUDGE}                     | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DELETED}   | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DELETED}   | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DELETED}   | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DELETED}   | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DELETED}   | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.DELETED}   | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.NEW}       | ${UserRole.REGISTRAR}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.NEW}       | ${UserRole.JUDGE}                     | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.NEW}       | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.NEW}       | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.NEW}       | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.NEW}       | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.NEW}       | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.NEW}       | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DRAFT}     | ${UserRole.JUDGE}                     | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}                 | ${InstitutionType.DISTRICT_COURT}
      ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DRAFT}     | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DRAFT}     | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.DRAFT}     | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.DRAFT}     | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.SUBMITTED} | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.SUBMITTED} | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.SUBMITTED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.SUBMITTED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.RECEIVED}  | ${UserRole.JUDGE}                     | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.RECEIVED}  | ${UserRole.ASSISTANT}                 | ${InstitutionType.COURT_OF_APPEALS}
      ${CaseState.RECEIVED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.RECEIVED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.REJECTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.REJECTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.ACCEPTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.ACCEPTED}  | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
      ${CaseState.DISMISSED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON}
      ${CaseState.DISMISSED} | ${UserRole.PRISON_SYSTEM_STAFF}       | ${InstitutionType.PRISON_ADMIN}
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
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(true)
      },
    )
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'given %s case',
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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
            creatingProsecutorId: 'Creating Prosecutor',
            creatingProsecutor: {
              id: 'Creating Prosecutor',
              institution: { id: 'Prosecutors Office' },
            },
            prosecutorId: 'Assigned Prosecutor',
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
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
            creatingProsecutorId: 'Creating Prosecutor',
            creatingProsecutor: {
              id: 'Creating Prosecutor',
              institution: { id: 'Prosecutors Office' },
            },
            prosecutorId: 'Assigned Prosecutor',
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
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
            institution: {
              id: 'Another Court',
              type: InstitutionType.DISTRICT_COURT,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
            institution: { id: 'Court', type: InstitutionType.DISTRICT_COURT },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
            institution: { id: 'Court', type: InstitutionType.DISTRICT_COURT },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(false)
          expect(isReadBlocked).toBe(false)
        })
      })

      each`
        state                  | role
        ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
        ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
        ${CaseState.ACCEPTED}  | ${UserRole.ASSISTANT}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}
        ${CaseState.REJECTED}  | ${UserRole.ASSISTANT}
        ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
        ${CaseState.DISMISSED} | ${UserRole.JUDGE}
        ${CaseState.DISMISSED} | ${UserRole.ASSISTANT}
      `.describe(
        'given a $state case and $role at court of appeals',
        ({ state, role }) => {
          it.each([CaseAppealState.RECEIVED, CaseAppealState.COMPLETED])(
            'should not block the case if the accused appealed in court',
            (appealState) => {
              // Arrange
              const theCase = {
                state,
                type,
                courtId: 'Court',
                appealState,
              } as Case
              const user = {
                role,
                institution: {
                  id: 'Court of Appeals Id',
                  type: InstitutionType.COURT_OF_APPEALS,
                },
              } as User

              // Act
              const isWriteBlocked = !canUserAccessCase(theCase, user)
              const isReadBlocked = !canUserAccessCase(theCase, user, false)

              // Assert
              expect(isWriteBlocked).toBe(false)
              expect(isReadBlocked).toBe(false)
            },
          )

          it.each([undefined, CaseAppealState.APPEALED])(
            'should block the case if an appealed has not been received',
            (appealState) => {
              // Arrange
              const theCase = {
                state,
                type,
                courtId: 'Court',
                appealState,
              } as Case
              const user = {
                role,
                institution: {
                  id: 'Court of Appeals Id',
                  type: InstitutionType.COURT_OF_APPEALS,
                },
              } as User

              // Act
              const isWriteBlocked = !canUserAccessCase(theCase, user)
              const isReadBlocked = !canUserAccessCase(theCase, user, false)

              // Assert
              expect(isWriteBlocked).toBe(true)
              expect(isReadBlocked).toBe(true)
            },
          )
        },
      )
    },
  )

  describe.each(indictmentCases)('given %s case', (type) => {
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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
              type: InstitutionType.PROSECUTORS_OFFICE,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
          creatingProsecutorId: 'Creating Prosecutor',
          creatingProsecutor: {
            id: 'Creating Prosecutor',
            institution: { id: 'Prosecutors Office' },
          },
          prosecutorId: 'Assigned Prosecutor',
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
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
          prosecutorId: 'Assigned Prosecutor',
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
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
          institution: {
            id: 'Another Court',
            type: InstitutionType.DISTRICT_COURT,
          },
        } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
          institution: { id: 'Court', type: InstitutionType.DISTRICT_COURT },
        } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
          institution: { id: 'Court', type: InstitutionType.DISTRICT_COURT },
        } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(false)
        expect(isReadBlocked).toBe(false)
      })
    })

    each`
        state                  | role
        ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
        ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
        ${CaseState.ACCEPTED}  | ${UserRole.ASSISTANT}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
        ${CaseState.REJECTED}  | ${UserRole.ASSISTANT}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}
        ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
        ${CaseState.DISMISSED} | ${UserRole.JUDGE}
        ${CaseState.DISMISSED} | ${UserRole.ASSISTANT}
      `.describe(
      'given a $state case and $role at court of appeals',
      ({ state, role }) => {
        it('should block the case if the accused appealed in court', () => {
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
              id: 'Court of Appeals Id',
              type: InstitutionType.COURT_OF_APPEALS,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        })

        it('should read block the case if the prosecutor appealed in court', () => {
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
              id: 'Court of Appeals Id',
              type: InstitutionType.COURT_OF_APPEALS,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        })

        it('should read block the case if the accused appealed out of court', () => {
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
              id: 'Court of Appeals Id',
              type: InstitutionType.COURT_OF_APPEALS,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
        })

        it('should read block the case if the prosecutor appealed out of court', () => {
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
              id: 'Court of Appeals Id',
              type: InstitutionType.COURT_OF_APPEALS,
            },
          } as User

          // Act
          const isWriteBlocked = !canUserAccessCase(theCase, user)
          const isReadBlocked = !canUserAccessCase(theCase, user, false)

          // Assert
          expect(isWriteBlocked).toBe(true)
          expect(isReadBlocked).toBe(true)
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
                id: 'Court of Appeals Id',
                type: InstitutionType.COURT_OF_APPEALS,
              },
            } as User

            // Act
            const isWriteBlocked = !canUserAccessCase(theCase, user)
            const isReadBlocked = !canUserAccessCase(theCase, user, false)

            // Assert
            expect(isWriteBlocked).toBe(true)
            expect(isReadBlocked).toBe(true)
          },
        )
      },
    )
  })

  describe.each(
    Object.values(investigationCases).filter(
      (type) => type !== CaseType.PAROLE_REVOCATION,
    ),
  )('given an accepted %s case', (type) => {
    each`
      institutionType
      ${InstitutionType.PRISON}
      ${InstitutionType.PRISON_ADMIN}
    `.it(
      'it should block the case from prison system staff at $institutionType',
      ({ institutionType }) => {
        // Arrange
        const theCase = {
          type,
          state: CaseState.ACCEPTED,
        } as Case
        const user = {
          role: UserRole.PRISON_SYSTEM_STAFF,
          institution: { type: institutionType },
        } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(true)
      },
    )
  })

  describe('given an accepted parole revocation case', () => {
    each`
      institutionType
      ${InstitutionType.PRISON}
      ${InstitutionType.PRISON_ADMIN}
    `.it(
      'it should not block the case from prison system staff at $institutionType',
      ({ institutionType }) => {
        // Arrange
        const theCase = {
          type: CaseType.PAROLE_REVOCATION,
          state: CaseState.ACCEPTED,
        } as Case
        const user = {
          role: UserRole.PRISON_SYSTEM_STAFF,
          institution: { type: institutionType },
        } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(false)
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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

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
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  it('should not read block an accepted admission to facility case from prison admin staff', () => {
    // Arrange
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      state: CaseState.ACCEPTED,
    } as Case
    const user = {
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: { type: InstitutionType.PRISON_ADMIN },
    } as User

    // Act
    const isWriteBlocked = !canUserAccessCase(theCase, user)
    const isReadBlocked = !canUserAccessCase(theCase, user, false)

    // Assert
    expect(isWriteBlocked).toBe(true)
    expect(isReadBlocked).toBe(false)
  })

  describe.each([
    ...restrictionCases,
    ...investigationCases,
    ...indictmentCases,
  ])('given %s case', (type) => {
    it.each(Object.values(CaseState))(
      'should block admin from reading or writing %s state',
      (state) => {
        // Arrange
        const theCase = { type, state } as Case
        const user = { role: UserRole.ADMIN } as User

        // Act
        const isWriteBlocked = !canUserAccessCase(theCase, user)
        const isReadBlocked = !canUserAccessCase(theCase, user, false)

        // Assert
        expect(isWriteBlocked).toBe(true)
        expect(isReadBlocked).toBe(true)
      },
    )
  })
})
