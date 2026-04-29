import faker from 'faker'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  AppealCase,
  Case,
  CaseAppealDecision,
  CaseType,
  CivilClaimant,
  Defendant,
  Gender,
  Notification,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as formatters from './formatters'
import {
  getAppealActorText,
  getDefaultDefendantGender,
  hasSentNotification,
} from './utils'

describe('Utils', () => {
  describe('removeTabs', () => {
    test('should replace a single tab with a single space', () => {
      // Arrange
      const str = '\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should replace multiple consecutive tabs with a single space', () => {
      // Arrange
      const str = '\t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a leading space', () => {
      // Arrange
      const str = ' \t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a trailing space', () => {
      // Arrange
      const str = '\t\t\t '

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should process a complicated string with tabs', () => {
      // Arrange
      const str =
        'Lorem\t ipsum dolor \t\tsit amet,\t\t\t\tconsectetur \t\t\t adipiscing elit.'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(
        'Lorem ipsum dolor sit amet, consectetur  adipiscing elit.',
      )
    })

    test('should handle undefined', () => {
      // Arrange

      // Act
      const res = formatters.replaceTabs(undefined as unknown as string)

      // Assert
      expect(res).toBeUndefined()
    })

    test('should handle string with no tabs', () => {
      // Arrange
      const str = '020-0202-2929'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual('020-0202-2929')
    })
  })

  describe('hasSentNotification', () => {
    test('should return false if notifications are not provided', () => {
      // Arrange
      const n1 = undefined
      const n2: Notification[] = []
      const nt = NotificationType.COURT_DATE

      // Act
      const res1 = hasSentNotification(nt, n1).hasSent
      const res2 = hasSentNotification(nt, n2).hasSent

      // Assert
      expect(res1).toEqual(false)
      expect(res2).toEqual(false)
    })

    test('should return false if a notification has been sent in the past but the last time it was sent it failed', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: false,
              address: email,
            },
          ],
        },
        {
          id: faker.datatype.uuid(),
          created: faker.date.past().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.COURT_DATE

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(false)
    })

    test('should return false if no notification is found of a specific notification type', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.REVOKED

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(false)
    })

    test('should return true if the latest notification has been sent successfully', () => {
      // Arrange
      const email = faker.internet.email()
      const n: Notification[] = [
        {
          id: faker.datatype.uuid(),
          created: faker.date.future().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
        {
          id: faker.datatype.uuid(),
          created: faker.date.past().toISOString(),
          caseId: faker.datatype.uuid(),
          type: NotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = NotificationType.COURT_DATE

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(true)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for a sole male defendant', () => {
      // Arrange
      const defendants = [{ gender: Gender.MALE } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return FEMALE for a sole female defendant', () => {
      // Arrange
      const defendants = [{ gender: Gender.FEMALE } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.FEMALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return OTHER for a sole defendant with other gender', () => {
      // Arrange
      const defendants = [{ gender: Gender.OTHER } as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.OTHER)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for a sole defendant with undefined gender', () => {
      // Arrange
      const defendants = [{} as Defendant]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for no defendant', () => {
      // Arrange
      const defendants: Defendant[] = []

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for undefined defendants', () => {
      // Arrange
      const defendants = undefined

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getDefaultDefendantGender', () => {
    test('should return MALE for multiple defendants', () => {
      // Arrange
      const defendants = [
        { gender: Gender.FEMALE } as Defendant,
        { gender: Gender.OTHER } as Defendant,
        { gender: Gender.MALE } as Defendant,
      ]

      // Act
      const gender = getDefaultDefendantGender(defendants)

      // Assert
      expect(gender).toBe(Gender.MALE)
    })
  })

  describe('getAppealActorText', () => {
    const appealedDate = '2026-04-01T12:00:00.000Z'
    const dateStr = formatDate(appealedDate, 'PPPp') ?? ''

    describe('request cases', () => {
      test('returns "Sækjandi kærði í þinghaldi" when prosecutor appealed in court', () => {
        const workingCase = {
          type: CaseType.CUSTODY,
          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
          appealCase: { appealedByRole: UserRole.PROSECUTOR } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          'Sækjandi kærði í þinghaldi',
        )
      })

      test('returns "Varnaraðili kærði í þinghaldi" when defender appealed in court', () => {
        const workingCase = {
          type: CaseType.CUSTODY,
          accusedAppealDecision: CaseAppealDecision.APPEAL,
          appealCase: { appealedByRole: UserRole.DEFENDER } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          'Varnaraðili kærði í þinghaldi',
        )
      })

      test('returns "Kært af sækjanda {date}" for out-of-court prosecutor appeal', () => {
        const workingCase = {
          type: CaseType.CUSTODY,
          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
          appealCase: {
            appealedByRole: UserRole.PROSECUTOR,
            appealedDate,
          } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Kært af sækjanda ${dateStr}`,
        )
      })

      test('returns "Verjandi {name} kærði úrskurðinn {date}" for confirmed defender', () => {
        const nationalId = '0101011010'
        const workingCase = {
          type: CaseType.CUSTODY,
          accusedAppealDecision: CaseAppealDecision.POSTPONE,
          defendants: [
            {
              id: 'defendant-1',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: nationalId,
              defenderName: 'Jón Jónsson',
            } as Defendant,
          ],
          appealCase: {
            appealedByRole: UserRole.DEFENDER,
            appealedByNationalId: nationalId,
            appealedDate,
          } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Verjandi Jón Jónsson kærði úrskurðinn ${dateStr}`,
        )
      })

      test('falls back to "Kært af verjanda {date}" when defender national id has no match', () => {
        const workingCase = {
          type: CaseType.CUSTODY,
          accusedAppealDecision: CaseAppealDecision.POSTPONE,
          defendants: [],
          civilClaimants: [],
          appealCase: {
            appealedByRole: UserRole.DEFENDER,
            appealedByNationalId: '0202022020',
            appealedDate,
          } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Kært af verjanda ${dateStr}`,
        )
      })
    })

    describe('indictment case-level appeals', () => {
      test('uses passive form for prosecutor appeal', () => {
        const workingCase = {
          type: CaseType.INDICTMENT,
          appealCase: {
            appealedByRole: UserRole.PROSECUTOR,
            appealedDate,
          } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Kært af sækjanda ${dateStr}`,
        )
      })

      test('uses passive fallback for defender without party match', () => {
        const workingCase = {
          type: CaseType.INDICTMENT,
          defendants: [],
          appealCase: {
            appealedByRole: UserRole.DEFENDER,
            appealedByNationalId: '0202022020',
            appealedDate,
          } as AppealCase,
        } as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Kært af verjanda ${dateStr}`,
        )
      })
    })

    describe('indictment ruling-order appeals', () => {
      test('uses subject-verb form for prosecutor', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedByRole: UserRole.PROSECUTOR,
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Sækjandi kærði úrskurðinn ${dateStr}`,
        )
      })

      test('returns "Verjandi {name} kærði úrskurðinn {date}" for confirmed defender', () => {
        const nationalId = '0101011010'
        const workingCase = {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'defendant-1',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: nationalId,
              defenderName: 'Jón Jónsson',
            } as Defendant,
          ],
        } as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: nationalId,
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Verjandi Jón Jónsson kærði úrskurðinn ${dateStr}`,
        )
      })

      test('returns "Lögmaður {name} kærði úrskurðinn {date}" for confirmed civil-claimant lawyer', () => {
        const nationalId = '0303033030'
        const workingCase = {
          type: CaseType.INDICTMENT,
          civilClaimants: [
            {
              id: 'cc-1',
              hasSpokesperson: true,
              isSpokespersonConfirmed: true,
              spokespersonIsLawyer: true,
              spokespersonNationalId: nationalId,
              spokespersonName: 'Anna Önnudóttir',
            } as CivilClaimant,
          ],
        } as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: nationalId,
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Lögmaður Anna Önnudóttir kærði úrskurðinn ${dateStr}`,
        )
      })

      test('falls back to "Verjandi kærði úrskurðinn {date}" when no party matches', () => {
        const workingCase = {
          type: CaseType.INDICTMENT,
          defendants: [],
        } as unknown as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: '0404044040',
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Verjandi kærði úrskurðinn ${dateStr}`,
        )
      })
    })
  })
})
