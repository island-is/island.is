import {
  AppealEventType,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealEventLog, Case, User } from '../../repository'
import { userIsAppellant } from '../appealCase.helpers'

const appealed = (fields: Partial<AppealEventLog> = {}): AppealEventLog =>
  ({ eventType: AppealEventType.APPEALED, ...fields } as AppealEventLog)

const appealCaseWith = (events: AppealEventLog[]): AppealCase =>
  ({ appealEventLogs: events } as AppealCase)

const prosecutor = {
  role: UserRole.PROSECUTOR,
  nationalId: '0000000000',
  institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
} as User

const defender = (nationalId: string) =>
  ({ role: UserRole.DEFENDER, nationalId } as User)

describe('userIsAppellant', () => {
  it('is false when the appeal case has no APPEALED event', () => {
    const theCase = { type: CaseType.INDICTMENT } as Case

    expect(userIsAppellant(theCase, appealCaseWith([]), prosecutor)).toBe(false)
  })

  describe('prosecution', () => {
    const theCase = { type: CaseType.CUSTODY } as Case

    it('is true when a prosecution APPEALED event exists', () => {
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.PROSECUTOR }),
      ])

      expect(userIsAppellant(theCase, appealCase, prosecutor)).toBe(true)
    })

    it('is false when only the defence appealed', () => {
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, prosecutor)).toBe(false)
    })
  })

  describe('request-case defence (collective)', () => {
    it('is true for the current registered case defender', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defenderNationalId: '0101010101',
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is false for a defender who is not the current case defender', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        defenderNationalId: '0101010101',
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('9999999999'))).toBe(
        false,
      )
    })
  })

  describe('indictment defence (per party)', () => {
    it('is true for the current confirmed defender of a defendant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'defendant-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is true for the current confirmed spokesperson of a civil claimant that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        civilClaimants: [
          {
            id: 'claimant-id',
            hasSpokesperson: true,
            isSpokespersonConfirmed: true,
            spokespersonNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({
          userRole: UserRole.DEFENDER,
          civilClaimantId: 'claimant-id',
        }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        true,
      )
    })

    it('is false when the user represents a different party than the one that appealed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'other-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        false,
      )
    })

    it('is false when the defender choice is not confirmed', () => {
      const theCase = {
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-id',
            isDefenderChoiceConfirmed: false,
            defenderNationalId: '0101010101',
          },
        ],
      } as Case
      const appealCase = appealCaseWith([
        appealed({ userRole: UserRole.DEFENDER, defendantId: 'defendant-id' }),
      ])

      expect(userIsAppellant(theCase, appealCase, defender('0101010101'))).toBe(
        false,
      )
    })
  })
})
