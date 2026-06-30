import faker from 'faker'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  AppealCase,
  AppealCaseState,
  Case,
  CaseAppealDecision,
  CaseFile,
  CaseFileCategory,
  CaseType,
  CivilClaimant,
  Defendant,
  Gender,
  InstitutionType,
  Notification,
  TrackedNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import * as formatters from './formatters'
import {
  getAppealActorText,
  getDefaultDefendantGender,
  hasSentNotification,
  isAppealFileCategoryVisible,
  mapStringToGender,
  reconcileAppealDecisionsForRulingFileChange,
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
      const nt = TrackedNotificationType.COURT_DATE

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
          type: TrackedNotificationType.COURT_DATE,
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
          type: TrackedNotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = TrackedNotificationType.COURT_DATE

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
          type: TrackedNotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = TrackedNotificationType.REVOKED

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
          type: TrackedNotificationType.COURT_DATE,
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
          type: TrackedNotificationType.COURT_DATE,
          recipients: [
            {
              success: true,
              address: email,
            },
          ],
        },
      ]
      const nt = TrackedNotificationType.COURT_DATE

      // Act
      const res = hasSentNotification(nt, n).hasSent

      // Assert
      expect(res).toEqual(true)
    })
  })

  describe('mapStringToGender', () => {
    test.each([
      ['male', Gender.MALE],
      ['MALE', Gender.MALE],
      ['Karl', Gender.MALE],
      [' karl ', Gender.MALE],
      ['female', Gender.FEMALE],
      ['FEMALE', Gender.FEMALE],
      ['Kona', Gender.FEMALE],
      [' kona ', Gender.FEMALE],
      ['other', Gender.OTHER],
      ['OTHER', Gender.OTHER],
      ['Kynsegin/Annað', Gender.OTHER],
    ])('maps %s to %s', (input, expected) => {
      expect(mapStringToGender(input)).toBe(expected)
    })

    test.each([undefined, null, '', '   ', 'unknown'])(
      'returns undefined for %s',
      (input) => {
        expect(mapStringToGender(input)).toBeUndefined()
      },
    )
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
        } as unknown as Case

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
          `Kært af ákæranda ${dateStr}`,
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
        } as unknown as Case

        expect(getAppealActorText(workingCase)).toBe(
          `Kært af verjanda ${dateStr}`,
        )
      })
    })

    describe('indictment ruling-order appeals', () => {
      test('returns "Kært í þinghaldi {date}" when appealed in court', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedInCourt: true,
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Kært í þinghaldi ${dateStr}`,
        )
      })

      test('uses subject-verb form for prosecutor', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'file-1',
          appealedByRole: UserRole.PROSECUTOR,
          appealedDate,
        } as AppealCase

        expect(getAppealActorText(workingCase, appealCase)).toBe(
          `Ákærandi kærði úrskurðinn ${dateStr}`,
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

  describe('reconcileAppealDecisionsForRulingFileChange', () => {
    const decisions = [
      { id: 'd1', rulingFileId: 'file-a' },
      { id: 'd2', rulingFileId: 'file-a' },
      { id: 'd3', rulingFileId: 'other-file' },
    ] as unknown as Case['appealDecisions']

    it('re-keys the ruling decisions onto the new file on a swap', () => {
      expect(
        reconcileAppealDecisionsForRulingFileChange(
          decisions,
          'file-a',
          'file-b',
        ),
      ).toEqual([
        { id: 'd1', rulingFileId: 'file-b' },
        { id: 'd2', rulingFileId: 'file-b' },
        { id: 'd3', rulingFileId: 'other-file' },
      ])
    })

    it('drops the ruling decisions on removal (no new file)', () => {
      expect(
        reconcileAppealDecisionsForRulingFileChange(decisions, 'file-a', null),
      ).toEqual([{ id: 'd3', rulingFileId: 'other-file' }])
    })

    it('is a no-op when the ruling file is unchanged', () => {
      expect(
        reconcileAppealDecisionsForRulingFileChange(
          decisions,
          'file-a',
          'file-a',
        ),
      ).toBe(decisions)
    })

    it('is a no-op when there was no previous ruling file', () => {
      expect(
        reconcileAppealDecisionsForRulingFileChange(decisions, null, 'file-b'),
      ).toBe(decisions)
    })

    it('handles missing appeal decisions', () => {
      expect(
        reconcileAppealDecisionsForRulingFileChange(
          undefined,
          'file-a',
          'file-b',
        ),
      ).toBeUndefined()
    })
  })

  describe('isAppealFileCategoryVisible', () => {
    const courtOfAppealsUser = {
      role: UserRole.COURT_OF_APPEALS_JUDGE,
      institution: { type: InstitutionType.COURT_OF_APPEALS },
    } as User
    const otherUser = {
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as User

    const file = (
      category: CaseFileCategory,
      extra: Partial<CaseFile> = {},
    ): CaseFile => ({ id: 'f', category, ...extra } as CaseFile)

    describe('briefs — appellant role', () => {
      test('shows prosecutor brief when prosecutor appealed', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides prosecutor brief when defender appealed', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealedByRole: UserRole.DEFENDER,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF),
            otherUser,
          ),
        ).toBe(false)
      })

      test('shows defendant brief when defender appealed', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealedByRole: UserRole.DEFENDER,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides defendant brief when prosecutor appealed', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_BRIEF),
            otherUser,
          ),
        ).toBe(false)
      })

      test("indictment: shows defendant brief when appellant national id matches the file's defender", () => {
        const nationalId = '0101011010'
        const workingCase = {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'd-1',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: nationalId,
            } as Defendant,
          ],
        } as Case
        const appealCase = {
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: nationalId,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_BRIEF, {
              defendantId: 'd-1',
            }),
            otherUser,
          ),
        ).toBe(true)
      })

      test("indictment: hides defendant brief when appellant national id does NOT match the file's defender", () => {
        const workingCase = {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'd-1',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: '0101011010',
            } as Defendant,
            {
              id: 'd-2',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: '0202022020',
            } as Defendant,
          ],
        } as Case
        const appealCase = {
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: '0101011010',
        } as AppealCase

        // d-2's brief should be hidden — appellant is d-1's defender.
        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_BRIEF, {
              defendantId: 'd-2',
            }),
            otherUser,
          ),
        ).toBe(false)
      })

      test("indictment: shows defendant brief when appellant matches the file's civil-claimant spokesperson", () => {
        const nationalId = '0303033030'
        const workingCase = {
          type: CaseType.INDICTMENT,
          civilClaimants: [
            {
              id: 'cc-1',
              hasSpokesperson: true,
              isSpokespersonConfirmed: true,
              spokespersonNationalId: nationalId,
            } as CivilClaimant,
          ],
        } as Case
        const appealCase = {
          appealedByRole: UserRole.DEFENDER,
          appealedByNationalId: nationalId,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE, {
              civilClaimantId: 'cc-1',
            }),
            otherUser,
          ),
        ).toBe(true)
      })
    })

    describe('statements — request cases (singular gate)', () => {
      test('shows defence statement when defendantStatementDate is set', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          defendantStatementDate: '2026-04-01T12:00:00.000Z',
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides defence statement when defendantStatementDate is unset', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {} as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT),
            otherUser,
          ),
        ).toBe(false)
      })

      test('shows prosecutor statement when prosecutorStatementDate is set', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          prosecutorStatementDate: '2026-04-01T12:00:00.000Z',
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE),
            otherUser,
          ),
        ).toBe(true)
      })
    })

    describe('statements — indictment cases (per-party gate)', () => {
      test('shows defendant statement when that defendant has submitted', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          defendantStatementDates: [
            { defendantId: 'd-1', statementDate: '2026-04-01T12:00:00.000Z' },
          ],
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT, {
              defendantId: 'd-1',
            }),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides defendant statement when that defendant has NOT submitted', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          defendantStatementDates: [
            { defendantId: 'd-1', statementDate: '2026-04-01T12:00:00.000Z' },
          ],
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT, {
              defendantId: 'd-2',
            }),
            otherUser,
          ),
        ).toBe(false)
      })

      test('shows civil-claimant statement when that claimant has submitted', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          civilClaimantStatementDates: [
            {
              civilClaimantId: 'cc-1',
              statementDate: '2026-04-01T12:00:00.000Z',
            },
          ],
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE, {
              civilClaimantId: 'cc-1',
            }),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides defence statement file with no party id attached', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          defendantStatementDates: [
            { defendantId: 'd-1', statementDate: '2026-04-01T12:00:00.000Z' },
          ],
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_STATEMENT),
            otherUser,
          ),
        ).toBe(false)
      })
    })

    describe('APPEAL_RULING and APPEAL_COURT_RECORD', () => {
      test('shows APPEAL_COURT_RECORD to all parties at COMPLETED', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealState: AppealCaseState.COMPLETED,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.APPEAL_COURT_RECORD),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides APPEAL_COURT_RECORD pre-COMPLETED to non-Court-of-Appeals users', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealState: AppealCaseState.RECEIVED,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.APPEAL_COURT_RECORD),
            otherUser,
          ),
        ).toBe(false)
      })

      test('shows APPEAL_RULING to Court of Appeals at any state', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {
          appealState: AppealCaseState.APPEALED,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.APPEAL_RULING),
            courtOfAppealsUser,
          ),
        ).toBe(true)
      })
    })

    describe('free-form *_APPEAL_CASE_FILE', () => {
      test('shows PROSECUTOR_APPEAL_CASE_FILE to prosecutors in request cases', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {} as AppealCase
        const prosecutor = { role: UserRole.PROSECUTOR } as User

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE),
            prosecutor,
          ),
        ).toBe(true)
      })

      test('hides PROSECUTOR_APPEAL_CASE_FILE from defenders in request cases', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {} as AppealCase
        const defender = { role: UserRole.DEFENDER } as User

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE),
            defender,
          ),
        ).toBe(false)
      })

      test('shows PROSECUTOR_APPEAL_CASE_FILE to defenders in indictment cases', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {} as AppealCase
        const defender = { role: UserRole.DEFENDER } as User

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE),
            defender,
          ),
        ).toBe(true)
      })

      test('shows DEFENDANT_APPEAL_CASE_FILE always', () => {
        const workingCase = { type: CaseType.CUSTODY } as Case
        const appealCase = {} as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE),
            otherUser,
          ),
        ).toBe(true)
      })
    })

    describe('rulingFileId scoping', () => {
      test('shows ruling-order file when its rulingFileId matches the appeal-case row', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'ruling-1',
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF, {
              rulingFileId: 'ruling-1',
            }),
            otherUser,
          ),
        ).toBe(true)
      })

      test('hides ruling-order file when its rulingFileId points to a different appeal', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'ruling-1',
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF, {
              rulingFileId: 'ruling-2',
            }),
            otherUser,
          ),
        ).toBe(false)
      })

      test('hides ruling-order file from a case-level appeal-case row', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF, {
              rulingFileId: 'ruling-1',
            }),
            otherUser,
          ),
        ).toBe(false)
      })

      test('hides case-level file from a ruling-order appeal-case row', () => {
        const workingCase = { type: CaseType.INDICTMENT } as Case
        const appealCase = {
          rulingFileId: 'ruling-1',
          appealedByRole: UserRole.PROSECUTOR,
        } as AppealCase

        expect(
          isAppealFileCategoryVisible(
            workingCase,
            appealCase,
            file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF),
            otherUser,
          ),
        ).toBe(false)
      })
    })

    test('returns false when no appealCase row is provided', () => {
      const workingCase = { type: CaseType.CUSTODY } as Case

      expect(
        isAppealFileCategoryVisible(
          workingCase,
          undefined,
          file(CaseFileCategory.PROSECUTOR_APPEAL_BRIEF),
          otherUser,
        ),
      ).toBe(false)
    })
  })
})
