import type {
  AppealCase,
  Case,
  CivilClaimant,
  CourtSessionResponse,
  DateLog,
  Defendant,
  IndictmentCount,
  User,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseDecision,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseLegalProvisions,
  CaseType,
  CourtSessionRulingType,
  CourtSessionStringType,
  CourtSessionType,
  DefendantPlea,
  DefenderChoice,
  Gender,
  IndictmentCountOffense,
  IndictmentDecision,
  IndictmentSubtype,
  RequestSharedWhen,
  RequestSharedWithDefender,
  SessionArrangements,
  SubpoenaType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  areAppealDecisionsComplete,
  getIndictmentCountWarningMessage,
  isAdminUserFormValid,
  isConclusionStepValid,
  isCourtHearingArrangemenstStepValidRC,
  isCourtHearingArrangementsStepValidIC,
  isCourtOfAppealCaseStepValid,
  isCourtOfAppealRulingStepFieldsValid,
  isCourtOfAppealRulingStepValid,
  isCourtOfAppealWithdrawnCaseStepValid,
  isCourtRecordStepValidIC,
  isCourtRecordStepValidRC,
  isCourtSessionValid,
  isDefendantStepValidIC,
  isDefendantStepValidIndictments,
  isDefendantStepValidRC,
  isDefenderStepValid,
  isGeneratedIndictmentCourtRecordValid,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isIndictmentCountComplete,
  isIndictmentStepValid,
  isNoGeneratedIndictmentCourtRecord,
  isNullOrUndefined,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidIC,
  isPoliceReportStepValidRC,
  isProcessingStepValidIndictments,
  isReceptionAndAssignmentStepValid,
  isRegistrationStepValid,
  isRulingValidIC,
  isRulingValidRC,
  isSubpoenaStepValid,
  validate,
} from './validate'

const POLICE_CASE_NUMBER = '012-3456-7890'

const createWorkingCase = (
  indictmentSubtypes: Record<string, IndictmentSubtype[]>,
): Case =>
  ({
    indictmentSubtypes,
  } as Case)

describe('isIndictmentCountComplete', () => {
  test('returns true for a complete non-traffic count', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      incidentDescription: 'Incident description',
      legalArguments: 'Legal arguments',
    } as IndictmentCount

    expect(isIndictmentCountComplete(indictmentCount, workingCase)).toBe(true)
  })

  test('returns false for an incomplete non-traffic count missing incidentDescription', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      legalArguments: 'Legal arguments',
    } as IndictmentCount

    expect(isIndictmentCountComplete(indictmentCount, workingCase)).toBe(false)
  })

  test('returns true for a complete traffic count', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.TRAFFIC_VIOLATION],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      vehicleRegistrationNumber: 'ABC123',
      lawsBroken: [[1]],
      incidentDescription: 'Incident description',
      legalArguments: 'Legal arguments',
      offenses: [{ offense: IndictmentCountOffense.DRUNK_DRIVING }],
    } as IndictmentCount

    expect(isIndictmentCountComplete(indictmentCount, workingCase)).toBe(true)
  })

  test('returns false for an incomplete traffic count missing vehicleRegistrationNumber', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.TRAFFIC_VIOLATION],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      lawsBroken: [[1]],
      incidentDescription: 'Incident description',
      legalArguments: 'Legal arguments',
      offenses: [{ offense: IndictmentCountOffense.DRUNK_DRIVING }],
    } as IndictmentCount

    expect(isIndictmentCountComplete(indictmentCount, workingCase)).toBe(false)
  })
})

describe('getIndictmentCountWarningMessage', () => {
  test('returns first missing field for non-traffic count', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      legalArguments: 'Legal arguments',
    } as IndictmentCount

    expect(getIndictmentCountWarningMessage(indictmentCount, workingCase)).toBe(
      'Vantar atvikalýsingu',
    )
  })

  test('returns legal arguments when incident description is filled', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      incidentDescription: 'Incident description',
    } as IndictmentCount

    expect(getIndictmentCountWarningMessage(indictmentCount, workingCase)).toBe(
      'Vantar heimfærslu',
    )
  })

  test('returns first missing field for traffic count', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.TRAFFIC_VIOLATION],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      lawsBroken: [[1]],
      incidentDescription: 'Incident description',
      legalArguments: 'Legal arguments',
      offenses: [{ offense: IndictmentCountOffense.DRUNK_DRIVING }],
    } as IndictmentCount

    expect(getIndictmentCountWarningMessage(indictmentCount, workingCase)).toBe(
      'Vantar skráningarnúmer ökutækis',
    )
  })

  test('returns undefined for a complete count', () => {
    const workingCase = createWorkingCase({
      [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
    })
    const indictmentCount = {
      policeCaseNumber: POLICE_CASE_NUMBER,
      incidentDescription: 'Incident description',
      legalArguments: 'Legal arguments',
    } as IndictmentCount

    expect(
      getIndictmentCountWarningMessage(indictmentCount, workingCase),
    ).toBeUndefined()
  })
})

describe('Validate empty', () => {
  test.each(['', undefined, '   ', '\t', '\n'])(
    'should fail for %j',
    (value) => {
      // Act
      const r = validate([[value, ['empty']]])

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Reitur má ekki vera tómur')
    },
  )

  test.each([' a ', '0'])('should be valid for %j', (value) => {
    // Act
    const r = validate([[value, ['empty']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })
})

describe('Validate police casenumber format', () => {
  test('should fail if not in correct form', () => {
    // Arrange
    const value = 'INCORRECT FORMAT'

    // Act
    const r = validate([[value, ['police-casenumber-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 012-3456-7890')
  })

  test('should fail if the last part is longer than six digits', () => {
    // Arrange
    const value = '007-2024-1234567'

    // Act
    const r = validate([[value, ['police-casenumber-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 012-3456-7890')
  })

  test('should fail if the number has not been finished', () => {
    // Arrange
    const value = '007-2024-'

    // Act
    const r = validate([[value, ['police-casenumber-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 012-3456-7890')
  })

  test.each(['007-2024-042535', '007-2024-1'])(
    'should be valid for %s',
    (value) => {
      // Act
      const r = validate([[value, ['police-casenumber-format']]])

      // Assert
      expect(r.isValid).toEqual(true)
    },
  )
})

describe('Validate time format', () => {
  test('should fail if time is not within the 24 hour clock', () => {
    // Arrange
    const time = '99:00'

    // Act
    const r = validate([[time, ['time-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 12:34 eða 1:23')
  })

  test('should be valid if with the hour part is one digit within the 24 hour clock', () => {
    // Arrange
    const time = '1:00'

    // Act
    const r = validate([[time, ['time-format']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })
})

describe('Validate national id format', () => {
  test('should be valid if all digits filled in', () => {
    // Arrange
    const nid = '000000-0000'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })

  test('should be valid with no -', () => {
    // Arrange
    const nid = '0000000000'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })

  test('should not be valid given just the first six digits', () => {
    // Arrange
    const nid = '010101'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })

  test('should not be valid given too few digits', () => {
    // Arrange
    const nid = '99120'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })

  test('should not be valid given invalid number of digits', () => {
    // Arrange
    const nid = '991201-22'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })
})

describe('Validate email format', () => {
  test('should not be valid if @ is missing', () => {
    // Arrange
    const invalidEmail = 'testATtest.is'

    // Act
    const validation = validate([[invalidEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(false)
    expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
  })

  test('should not be valid if the ending is less than two characters', () => {
    // Arrange
    const invalidEmail = 'testATtest.i'

    // Act
    const validation = validate([[invalidEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(false)
    expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
  })

  test('should be valid if email is empty', () => {
    // Arrange

    // Act
    const validation = validate([['', ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email contains - and . characters', () => {
    // Arrange
    const validEmail = 'garfield.lasagne-lover@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email is valid', () => {
    // Arrange
    const validEmail = 'garfield@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email contains + characters', () => {
    // Arrange
    const validEmail = 'garfield+test@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })
})

describe('Validate phonenumber format', () => {
  test('should fail if not in correct form', () => {
    // Arrange
    const phonenumber = '00292'

    // Act
    const r = validate([[phonenumber, ['phonenumber']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 555-5555')
  })

  test('should pass if in correct form', () => {
    // Arrange
    const phonenumber = '555-5555'

    // Act
    const r = validate([[phonenumber, ['phonenumber']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })
})

describe('Validate court case number', () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2020-01-01') })
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test.each`
    courtCaseNumber
    ${'R-1/2019'}
    ${'R-22/2022'}
    ${'R-7536/1993'}
    ${'R-333/3333'}
    ${'R-12345/2014'}
  `(
    'should pass when case as correct format $R-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['R-case-number']]])
      expect(result.isValid).toEqual(true)
    },
  )

  test.each`
    courtCaseNumber
    ${'2019'}
    ${'r-1/2019'}
    ${'R.1/2019'}
    ${'R/1/2019'}
    ${'R/1-2019'}
    ${'R/1-2019'}
    ${'R-1-2019'}
    ${'R-1/201'}
    ${'R-1/201'}
  `(
    'should fail if case number as wrong format $R-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['R-case-number']]])
      expect(result.isValid).toEqual(false)
      expect(result.errorMessage).toEqual('Dæmi: R-1234/2020')
    },
  )

  test.each`
    courtCaseNumber
    ${'S-1/2019'}
    ${'S-22/2022'}
    ${'S-7536/1993'}
    ${'S-333/3333'}
    ${'S-12345/2014'}
  `(
    'should pass when case as correct format $S-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['S-case-number']]])
      expect(result.isValid).toEqual(true)
    },
  )

  test.each`
    courtCaseNumber
    ${'2019'}
    ${'s-1/2019'}
    ${'S.1/2019'}
    ${'S/1/2019'}
    ${'S/1-2019'}
    ${'S/1-2019'}
    ${'S-1-2019'}
    ${'S-1/201'}
    ${'S-1/201'}
  `(
    'should fail if case number as wrong format $S-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['S-case-number']]])
      expect(result.isValid).toEqual(false)
      expect(result.errorMessage).toEqual('Dæmi: S-1234/2020')
    },
  )
})

describe('areAppealDecisionsComplete', () => {
  const rulingFileId = 'ruling-file-id'
  const courtSession = { rulingFileId } as CourtSessionResponse

  const decisionFor = (
    party: {
      partyRole: AppealDecisionPartyRole
      defendantId?: string
      civilClaimantId?: string
    },
    decision: CaseAppealDecision | null = CaseAppealDecision.ACCEPT,
  ) => ({ rulingFileId, decision, ...party })

  const baseCase = {
    defendants: [{ id: 'd1' }],
    civilClaimants: [{ id: 'c1' }],
  } as Case

  it('is true when every party has a decision', () => {
    const workingCase = {
      ...baseCase,
      appealDecisions: [
        decisionFor({ partyRole: AppealDecisionPartyRole.PROSECUTOR }),
        decisionFor({
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'd1',
        }),
        decisionFor({
          partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
          civilClaimantId: 'c1',
        }),
      ],
    } as Case

    expect(areAppealDecisionsComplete(courtSession, workingCase)).toBe(true)
  })

  it('is false when a defendant has no decision', () => {
    const workingCase = {
      ...baseCase,
      appealDecisions: [
        decisionFor({ partyRole: AppealDecisionPartyRole.PROSECUTOR }),
        decisionFor({
          partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
          civilClaimantId: 'c1',
        }),
      ],
    } as Case

    expect(areAppealDecisionsComplete(courtSession, workingCase)).toBe(false)
  })

  it('is false when a party has an announcement but no decision', () => {
    const workingCase = {
      ...baseCase,
      appealDecisions: [
        decisionFor({ partyRole: AppealDecisionPartyRole.PROSECUTOR }, null),
        decisionFor({
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'd1',
        }),
        decisionFor({
          partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
          civilClaimantId: 'c1',
        }),
      ],
    } as Case

    expect(areAppealDecisionsComplete(courtSession, workingCase)).toBe(false)
  })

  it('is false when the session has no ruling file', () => {
    expect(
      areAppealDecisionsComplete({} as CourtSessionResponse, baseCase),
    ).toBe(false)
  })
})

describe('isSubpoenaStepValid', () => {
  const alternativeServiceDefendant = {
    id: 'defendant-1',
    isAlternativeService: true,
    alternativeServiceDescription: 'Ákæra birt í þinghaldi',
  } as Defendant

  const subpoenaDefendant = {
    id: 'defendant-2',
    subpoenaType: SubpoenaType.ABSENCE,
  } as Defendant

  const arraignmentDate = {
    date: '2026-09-01T10:00:00.000Z',
    location: 'Dómsalur 1',
  } as DateLog

  test('returns true when an arraignment date and courtroom are registered', () => {
    const workingCase = {
      defendants: [subpoenaDefendant],
      arraignmentDate,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(true)
  })

  test('returns false when the arraignment date is missing', () => {
    const workingCase = {
      defendants: [subpoenaDefendant],
      arraignmentDate: { location: 'Dómsalur 1' } as DateLog,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })

  test('returns false when the courtroom is missing', () => {
    const workingCase = {
      defendants: [subpoenaDefendant],
      arraignmentDate: { date: '2026-09-01T10:00:00.000Z' } as DateLog,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })

  test('returns true without an arraignment date when the summons is skipped and every defendant is served by alternative means', () => {
    const workingCase = {
      defendants: [alternativeServiceDefendant],
      isArraignmentSummonsSkipped: true,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(true)
  })

  test('returns false when the summons is skipped but a defendant is still receiving a subpoena', () => {
    const workingCase = {
      defendants: [alternativeServiceDefendant, subpoenaDefendant],
      isArraignmentSummonsSkipped: true,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })

  test('prefers the updated skip flag over the persisted one', () => {
    const workingCase = {
      defendants: [alternativeServiceDefendant],
      isArraignmentSummonsSkipped: true,
    } as Case

    expect(
      isSubpoenaStepValid(
        workingCase,
        [alternativeServiceDefendant],
        null,
        false,
      ),
    ).toBe(false)
  })

  test('returns false when an alternative service defendant has no description', () => {
    const workingCase = {
      defendants: [{ id: 'defendant-1', isAlternativeService: true }],
      isArraignmentSummonsSkipped: true,
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })

  test('returns false when the case has no defendants', () => {
    const workingCase = {
      defendants: [],
      isArraignmentSummonsSkipped: true,
    } as unknown as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })
})

describe('isCourtOfAppealRulingStepValid', () => {
  const appealCase = {
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealConclusion: 'Niðurstaða',
  } as AppealCase

  const appealRulingFile = (rulingFileId: string | null) => ({
    category: CaseFileCategory.APPEAL_RULING,
    rulingFileId,
  })

  it('is true when the case level appeal has its own appeal ruling', () => {
    const workingCase = { caseFiles: [appealRulingFile(null)] } as Case

    expect(isCourtOfAppealRulingStepValid(workingCase, appealCase)).toBe(true)
  })

  it('is false when the only appeal ruling belongs to a ruling order appeal', () => {
    const workingCase = { caseFiles: [appealRulingFile('ruling-1')] } as Case

    expect(isCourtOfAppealRulingStepValid(workingCase, appealCase)).toBe(false)
  })

  it('is true when the ruling order appeal has its own appeal ruling', () => {
    const workingCase = { caseFiles: [appealRulingFile('ruling-1')] } as Case

    expect(
      isCourtOfAppealRulingStepValid(workingCase, {
        ...appealCase,
        rulingFileId: 'ruling-1',
      } as AppealCase),
    ).toBe(true)
  })

  it('is false when the appeal ruling belongs to another ruling order appeal', () => {
    const workingCase = { caseFiles: [appealRulingFile('ruling-1')] } as Case

    expect(
      isCourtOfAppealRulingStepValid(workingCase, {
        ...appealCase,
        rulingFileId: 'ruling-2',
      } as AppealCase),
    ).toBe(false)
  })

  it('does not require an appeal ruling when the appeal was discontinued', () => {
    const workingCase = { caseFiles: [] } as unknown as Case

    expect(
      isCourtOfAppealRulingStepValid(workingCase, {
        appealRulingDecision: AppealCaseRulingDecision.DISCONTINUED,
      } as AppealCase),
    ).toBe(true)
  })
})

describe('validate', () => {
  test('is valid for an empty list of items', () => {
    expect(validate([])).toEqual({ isValid: true, errorMessage: '' })
  })

  test('skips items marked as valid', () => {
    expect(validate(['valid', ['abc', ['empty']]]).isValid).toBe(true)
  })

  test('skips format validations when the value is missing', () => {
    expect(
      validate([
        [undefined, ['email-format']],
        [null, ['phonenumber']],
        ['', ['national-id']],
      ]).isValid,
    ).toBe(true)
  })

  test('reports the first failing item', () => {
    const result = validate([
      ['valid@dummy.dd', ['email-format']],
      ['', ['empty']],
      ['not a phone', ['phonenumber']],
    ])

    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Reitur má ekki vera tómur')
  })

  test('reports the first failing validation of an item', () => {
    const result = validate([['   ', ['empty', 'national-id']]])

    expect(result.errorMessage).toBe('Reitur má ekki vera tómur')
  })
})

describe('Validate date of birth format', () => {
  test.each(['01.02.1990', '31.12.2005', '29.02.2000'])(
    'should be valid for %s',
    (value) => {
      expect(validate([[value, ['date-of-birth']]]).isValid).toBe(true)
    },
  )

  test.each([
    '32.01.1990',
    '00.01.1990',
    '1.2.1990',
    '01-02-1990',
    '01.13.1990',
    '01.02.1890',
    '01.02.90',
  ])('should fail for %s', (value) => {
    const result = validate([[value, ['date-of-birth']]])

    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Dæmi: 00.00.0000')
  })
})

describe('Validate date format', () => {
  test.each(['2024-01-01T10:00:00Z', '2024-01-01T10:00:00.000Z'])(
    'should be valid for %s',
    (value) => {
      expect(validate([[value, ['date-format']]]).isValid).toBe(true)
    },
  )

  test.each(['2024-01-01', '2024-01-01 10:00:00', '2024-01-01T10:00:00'])(
    'should fail for %s',
    (value) => {
      const result = validate([[value, ['date-format']]])

      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('')
    },
  )
})

describe('Validate appeal case number format', () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2020-01-01') })
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test.each(['1/2024', '1234/2024'])('should be valid for %s', (value) => {
    expect(validate([[value, ['appeal-case-number-format']]]).isValid).toBe(
      true,
    )
  })

  test.each(['12345/2024', 'A-1/2024', '1/24', '1-2024'])(
    'should fail for %s',
    (value) => {
      const result = validate([[value, ['appeal-case-number-format']]])

      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('Dæmi: 1234/2020')
    },
  )
})

const ISO_DATE = '2024-01-01T10:00:00.000Z'
const NATIONAL_ID = '010101-0101'
const BUSINESS_NATIONAL_ID = '500101-0101'

const validDefendant = {
  id: 'd1',
  nationalId: NATIONAL_ID,
  gender: Gender.MALE,
  name: 'Jón Jónsson',
  address: 'Gata 1',
} as Defendant

describe('isRegistrationStepValid', () => {
  test('is true when the type matches and every police case number is well formed', () => {
    const workingCase = { type: CaseType.CUSTODY } as Case

    expect(
      isRegistrationStepValid(workingCase, CaseType.CUSTODY, [
        POLICE_CASE_NUMBER,
      ]),
    ).toBe(true)
  })

  test.each([[], undefined, null])(
    'is false when the police case numbers are %j',
    (policeCaseNumbers) => {
      const workingCase = { type: CaseType.CUSTODY } as Case

      expect(
        isRegistrationStepValid(
          workingCase,
          CaseType.CUSTODY,
          policeCaseNumbers,
        ),
      ).toBe(false)
    },
  )

  test('is false when the selected type has not been saved to the case', () => {
    const workingCase = { type: CaseType.CUSTODY } as Case

    expect(
      isRegistrationStepValid(workingCase, CaseType.TRAVEL_BAN, [
        POLICE_CASE_NUMBER,
      ]),
    ).toBe(false)
  })

  test('is false when a police case number is malformed', () => {
    const workingCase = { type: CaseType.CUSTODY } as Case

    expect(
      isRegistrationStepValid(workingCase, CaseType.CUSTODY, [
        POLICE_CASE_NUMBER,
        '012-3456-',
      ]),
    ).toBe(false)
  })
})

describe('isDefendantStepValidRC', () => {
  const validCase = {
    type: CaseType.CUSTODY,
    defendants: [validDefendant],
    leadInvestigator: 'Lögreglumaður',
  } as Case

  test('is true for a complete custody case', () => {
    expect(isDefendantStepValidRC(validCase, [POLICE_CASE_NUMBER])).toBe(true)
  })

  test.each([[], undefined])(
    'is false when the police case numbers are %j',
    (policeCaseNumbers) => {
      expect(isDefendantStepValidRC(validCase, policeCaseNumbers)).toBe(false)
    },
  )

  test('is false when a police case number is malformed', () => {
    expect(isDefendantStepValidRC(validCase, ['012-3456'])).toBe(false)
  })

  test('is false when the case has no defendants', () => {
    expect(
      isDefendantStepValidRC({ ...validCase, defendants: [] } as Case, [
        POLICE_CASE_NUMBER,
      ]),
    ).toBe(false)
  })

  test.each(['name', 'address', 'gender', 'nationalId'] as const)(
    'is false when the first defendant is missing %s',
    (field) => {
      const workingCase = {
        ...validCase,
        defendants: [{ ...validDefendant, [field]: undefined }],
      } as Case

      expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(
        false,
      )
    },
  )

  test('is false when the first defendant has a malformed national id', () => {
    const workingCase = {
      ...validCase,
      defendants: [{ ...validDefendant, nationalId: '0101010101X' }],
    } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(
      false,
    )
  })

  test('accepts a date of birth when the defendant has no national id', () => {
    const workingCase = {
      ...validCase,
      defendants: [
        { ...validDefendant, noNationalId: true, nationalId: '01.01.1990' },
      ],
    } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(true)
  })

  test('does not require a gender for a business defendant', () => {
    const workingCase = {
      ...validCase,
      defendants: [
        {
          ...validDefendant,
          nationalId: BUSINESS_NATIONAL_ID,
          gender: undefined,
        },
      ],
    } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(true)
  })

  test('only validates the first defendant', () => {
    const workingCase = {
      ...validCase,
      defendants: [validDefendant, { id: 'd2' }],
    } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(true)
  })

  test('requires a lead investigator for custody cases', () => {
    const workingCase = { ...validCase, leadInvestigator: undefined } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(
      false,
    )
  })

  test('does not require a lead investigator for travel ban cases', () => {
    const workingCase = {
      ...validCase,
      type: CaseType.TRAVEL_BAN,
      leadInvestigator: undefined,
    } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(true)
  })

  test('requires a decision on sharing the request when a defender is named', () => {
    const withDefender = { ...validCase, defenderName: 'Verjandi' } as Case

    expect(isDefendantStepValidRC(withDefender, [POLICE_CASE_NUMBER])).toBe(
      false,
    )
    expect(
      isDefendantStepValidRC(
        {
          ...withDefender,
          requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
        } as Case,
        [POLICE_CASE_NUMBER],
      ),
    ).toBe(true)
  })

  test('is false when the defender email is malformed', () => {
    const workingCase = { ...validCase, defenderEmail: 'not-an-email' } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(
      false,
    )
  })

  test('is false when the defender phone number is malformed', () => {
    const workingCase = { ...validCase, defenderPhoneNumber: '12345' } as Case

    expect(isDefendantStepValidRC(workingCase, [POLICE_CASE_NUMBER])).toBe(
      false,
    )
  })
})

describe('isDefendantStepValidIC', () => {
  const validCase = {
    type: CaseType.SEARCH_WARRANT,
    defendants: [validDefendant],
  } as Case

  const validVictim = {
    id: 'v1',
    hasNationalId: true,
    nationalId: NATIONAL_ID,
    name: 'Brotaþoli',
  } as Victim

  test('is true for a complete case without victims', () => {
    expect(isDefendantStepValidIC(validCase)).toBe(true)
  })

  test('is false when the case has no defendants', () => {
    expect(
      isDefendantStepValidIC({ ...validCase, defendants: [] } as Case),
    ).toBe(false)
  })

  test('validates every defendant', () => {
    const workingCase = {
      ...validCase,
      defendants: [validDefendant, { id: 'd2' }],
    } as Case

    expect(isDefendantStepValidIC(workingCase)).toBe(false)
  })

  test('requires a gender for a person but not for a business', () => {
    const person = {
      ...validCase,
      defendants: [{ ...validDefendant, gender: undefined }],
    } as Case
    const business = {
      ...validCase,
      defendants: [
        {
          ...validDefendant,
          nationalId: BUSINESS_NATIONAL_ID,
          gender: undefined,
        },
      ],
    } as Case

    expect(isDefendantStepValidIC(person)).toBe(false)
    expect(isDefendantStepValidIC(business)).toBe(true)
  })

  test('is true when every victim is complete', () => {
    expect(
      isDefendantStepValidIC({ ...validCase, victims: [validVictim] } as Case),
    ).toBe(true)
  })

  test('is false when a victim has no name', () => {
    const workingCase = {
      ...validCase,
      victims: [{ ...validVictim, name: undefined }],
    } as Case

    expect(isDefendantStepValidIC(workingCase)).toBe(false)
  })

  test('is false when a victim with a national id has none registered', () => {
    const workingCase = {
      ...validCase,
      victims: [{ ...validVictim, nationalId: undefined }],
    } as Case

    expect(isDefendantStepValidIC(workingCase)).toBe(false)
  })

  test('accepts a date of birth for a victim without a national id', () => {
    const workingCase = {
      ...validCase,
      victims: [
        { ...validVictim, hasNationalId: false, nationalId: '01.01.1990' },
      ],
    } as Case

    expect(isDefendantStepValidIC(workingCase)).toBe(true)
  })

  test('requires request access for a victim with a lawyer', () => {
    const withLawyer = {
      ...validCase,
      victims: [{ ...validVictim, lawyerNationalId: NATIONAL_ID }],
    } as Case
    const withAccess = {
      ...validCase,
      victims: [
        {
          ...validVictim,
          lawyerNationalId: NATIONAL_ID,
          lawyerAccessToRequest: RequestSharedWhen.READY_FOR_COURT,
        },
      ],
    } as Case

    expect(isDefendantStepValidIC(withLawyer)).toBe(false)
    expect(isDefendantStepValidIC(withAccess)).toBe(true)
  })

  test('requires a decision on sharing the request when a defender is named', () => {
    const withDefender = { ...validCase, defenderName: 'Verjandi' } as Case

    expect(isDefendantStepValidIC(withDefender)).toBe(false)
    expect(
      isDefendantStepValidIC({
        ...withDefender,
        requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
      } as Case),
    ).toBe(true)
  })

  test('is false when the defender contact details are malformed', () => {
    expect(
      isDefendantStepValidIC({ ...validCase, defenderEmail: 'nope' } as Case),
    ).toBe(false)
    expect(
      isDefendantStepValidIC({
        ...validCase,
        defenderPhoneNumber: '1',
      } as Case),
    ).toBe(false)
  })
})

describe('isDefendantStepValidIndictments', () => {
  const validCase = {
    type: CaseType.INDICTMENT,
    prosecutor: { id: 'p1' },
    policeCaseNumbers: [POLICE_CASE_NUMBER],
    indictmentSubtypes: { [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT] },
    defendants: [validDefendant],
  } as Case

  test('is true for a complete case', () => {
    expect(isDefendantStepValidIndictments(validCase)).toBe(true)
  })

  test('is false without a prosecutor', () => {
    expect(
      isDefendantStepValidIndictments({
        ...validCase,
        prosecutor: undefined,
      } as Case),
    ).toBe(false)
  })

  test.each([[], undefined])(
    'is false when the police case numbers are %j',
    (policeCaseNumbers) => {
      expect(
        isDefendantStepValidIndictments({
          ...validCase,
          policeCaseNumbers,
        } as Case),
      ).toBe(false)
    },
  )

  test('is false when a police case number is malformed', () => {
    const malformed = '012-3456'
    const workingCase = {
      ...validCase,
      policeCaseNumbers: [POLICE_CASE_NUMBER, malformed],
      indictmentSubtypes: {
        [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT],
        [malformed]: [IndictmentSubtype.THEFT],
      },
    } as Case

    expect(isDefendantStepValidIndictments(workingCase)).toBe(false)
  })

  test.each([undefined, {}, { [POLICE_CASE_NUMBER]: [] }])(
    'is false when a police case number has no subtypes (%j)',
    (indictmentSubtypes) => {
      expect(
        isDefendantStepValidIndictments({
          ...validCase,
          indictmentSubtypes,
        } as Case),
      ).toBe(false)
    },
  )

  test('is false when the case has no defendants', () => {
    expect(
      isDefendantStepValidIndictments({
        ...validCase,
        defendants: [],
      } as Case),
    ).toBe(false)
  })

  test('validates every defendant', () => {
    expect(
      isDefendantStepValidIndictments({
        ...validCase,
        defendants: [validDefendant, { id: 'd2' }],
      } as Case),
    ).toBe(false)
  })
})

describe('isHearingArrangementsStepValidRC', () => {
  const validCase = {
    type: CaseType.CUSTODY,
    prosecutor: { id: 'p1' },
    court: { id: 'c1' },
    requestedCourtDate: ISO_DATE,
    arrestDate: ISO_DATE,
  } as Case

  test('is true for a complete custody case', () => {
    expect(isHearingArrangementsStepValidRC(validCase)).toBe(true)
  })

  test.each([
    'prosecutor',
    'court',
    'requestedCourtDate',
    'arrestDate',
  ] as const)('is false when %s is missing', (field) => {
    expect(
      isHearingArrangementsStepValidRC({
        ...validCase,
        [field]: undefined,
      } as Case),
    ).toBe(false)
  })

  test('is false when a date is not in ISO format', () => {
    expect(
      isHearingArrangementsStepValidRC({
        ...validCase,
        requestedCourtDate: '01.01.2024',
      } as Case),
    ).toBe(false)
  })

  test('does not require an arrest date for travel ban cases', () => {
    expect(
      isHearingArrangementsStepValidRC({
        ...validCase,
        type: CaseType.TRAVEL_BAN,
        arrestDate: undefined,
      } as Case),
    ).toBe(true)
  })

  test('does not require an arrest date for extension cases', () => {
    expect(
      isHearingArrangementsStepValidRC({
        ...validCase,
        parentCase: { id: 'parent' },
        arrestDate: undefined,
      } as Case),
    ).toBe(true)
  })
})

describe('isHearingArrangementsStepValidIC', () => {
  const validCase = {
    prosecutor: { id: 'p1' },
    court: { id: 'c1' },
    requestedCourtDate: ISO_DATE,
  } as Case

  test('is true for a complete case', () => {
    expect(isHearingArrangementsStepValidIC(validCase)).toBe(true)
  })

  test.each(['prosecutor', 'court', 'requestedCourtDate'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(
        isHearingArrangementsStepValidIC({
          ...validCase,
          [field]: undefined,
        } as Case),
      ).toBe(false)
    },
  )

  test('does not require an arrest date', () => {
    expect(
      isHearingArrangementsStepValidIC({
        ...validCase,
        arrestDate: undefined,
      } as Case),
    ).toBe(true)
  })
})

describe('isProcessingStepValidIndictments', () => {
  const pleadingDefendant = {
    ...validDefendant,
    defendantPlea: DefendantPlea.NOT_GUILTY,
    policeCaseNumbers: [POLICE_CASE_NUMBER],
  } as Defendant

  const validCase = {
    court: { id: 'c1' },
    hasCivilClaims: false,
    defendants: [pleadingDefendant],
  } as Case

  const validCivilClaimant = {
    id: 'cc1',
    name: 'Kröfuhafi',
    nationalId: NATIONAL_ID,
    policeCaseNumbers: [POLICE_CASE_NUMBER],
    defendantIds: [pleadingDefendant.id],
  } as CivilClaimant

  test('is true for a complete case without civil claims', () => {
    expect(isProcessingStepValidIndictments(validCase)).toBe(true)
  })

  test('is false without a court', () => {
    expect(
      isProcessingStepValidIndictments({
        ...validCase,
        court: undefined,
      } as Case),
    ).toBe(false)
  })

  test.each([undefined, null])(
    'is false when the civil claims question is unanswered (%j)',
    (hasCivilClaims) => {
      expect(
        isProcessingStepValidIndictments({
          ...validCase,
          hasCivilClaims,
        } as Case),
      ).toBe(false)
    },
  )

  test('is false when the case has no defendants', () => {
    expect(
      isProcessingStepValidIndictments({
        ...validCase,
        defendants: [],
      } as Case),
    ).toBe(false)
  })

  test('is false when a defendant has not entered a plea', () => {
    expect(
      isProcessingStepValidIndictments({
        ...validCase,
        defendants: [pleadingDefendant, { ...validDefendant, id: 'd2' }],
      } as Case),
    ).toBe(false)
  })

  describe('with civil claims', () => {
    const withClaims = (civilClaimant: Partial<CivilClaimant>) =>
      ({
        ...validCase,
        hasCivilClaims: true,
        civilClaimants: [{ ...validCivilClaimant, ...civilClaimant }],
      } as Case)

    test('is true when every civil claimant is complete', () => {
      expect(isProcessingStepValidIndictments(withClaims({}))).toBe(true)
    })

    test('is false when there are no civil claimants', () => {
      expect(
        isProcessingStepValidIndictments({
          ...validCase,
          hasCivilClaims: true,
          civilClaimants: undefined,
        } as Case),
      ).toBe(false)
    })

    test('is false when a civil claimant has no name', () => {
      expect(
        isProcessingStepValidIndictments(withClaims({ name: undefined })),
      ).toBe(false)
    })

    test('is false when a civil claimant has no police case numbers', () => {
      expect(
        isProcessingStepValidIndictments(withClaims({ policeCaseNumbers: [] })),
      ).toBe(false)
    })

    test('is false when a civil claimant is not linked to an available defendant', () => {
      expect(
        isProcessingStepValidIndictments(withClaims({ defendantIds: [] })),
      ).toBe(false)
    })

    test('is false when a civil claimant national id is malformed', () => {
      expect(
        isProcessingStepValidIndictments(withClaims({ nationalId: '0101' })),
      ).toBe(false)
    })

    test('accepts a date of birth when the civil claimant has no national id', () => {
      expect(
        isProcessingStepValidIndictments(
          withClaims({ noNationalId: true, nationalId: '01.01.1990' }),
        ),
      ).toBe(true)
    })
  })
})

describe('isIndictmentStepValid', () => {
  const completeCount = {
    policeCaseNumber: POLICE_CASE_NUMBER,
    incidentDescription: 'Atvik',
    legalArguments: 'Heimfærsla',
  } as IndictmentCount

  const validCase = {
    indictmentSubtypes: { [POLICE_CASE_NUMBER]: [IndictmentSubtype.THEFT] },
    demands: 'Kröfur',
    hasCivilClaims: false,
    indictmentCounts: [completeCount],
  } as Case

  test('is true for a complete indictment', () => {
    expect(isIndictmentStepValid(validCase)).toBe(true)
  })

  test('is false without demands', () => {
    expect(
      isIndictmentStepValid({ ...validCase, demands: undefined } as Case),
    ).toBe(false)
  })

  test('requires civil demands when the case has civil claims', () => {
    const withClaims = { ...validCase, hasCivilClaims: true } as Case

    expect(isIndictmentStepValid(withClaims)).toBe(false)
    expect(
      isIndictmentStepValid({
        ...withClaims,
        civilDemands: 'Bótakrafa',
      } as Case),
    ).toBe(true)
  })

  test('is false without indictment subtypes', () => {
    expect(
      isIndictmentStepValid({
        ...validCase,
        indictmentSubtypes: undefined,
      } as Case),
    ).toBe(false)
  })

  test.each([[], undefined])(
    'is false when the indictment counts are %j',
    (indictmentCounts) => {
      expect(
        isIndictmentStepValid({ ...validCase, indictmentCounts } as Case),
      ).toBe(false)
    },
  )

  test('is false when any indictment count is incomplete', () => {
    expect(
      isIndictmentStepValid({
        ...validCase,
        indictmentCounts: [
          completeCount,
          { ...completeCount, legalArguments: undefined },
        ],
      } as Case),
    ).toBe(false)
  })
})

describe('isPoliceDemandsStepValidRC', () => {
  const validCase = {
    lawsBroken: 'Lagaákvæði',
    requestedValidToDate: ISO_DATE,
    legalProvisions: [CaseLegalProvisions._95_1_A],
  } as Case

  test('is true with legal provisions', () => {
    expect(isPoliceDemandsStepValidRC(validCase)).toBe(true)
  })

  test('accepts a legal basis instead of legal provisions', () => {
    expect(
      isPoliceDemandsStepValidRC({
        ...validCase,
        legalProvisions: [],
        legalBasis: 'Lagagrundvöllur',
      } as Case),
    ).toBe(true)
  })

  test('is false with neither legal provisions nor a legal basis', () => {
    expect(
      isPoliceDemandsStepValidRC({
        ...validCase,
        legalProvisions: undefined,
      } as Case),
    ).toBe(false)
  })

  test.each(['lawsBroken', 'requestedValidToDate'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(
        isPoliceDemandsStepValidRC({
          ...validCase,
          [field]: undefined,
        } as Case),
      ).toBe(false)
    },
  )

  test('is false when the requested valid to date is not in ISO format', () => {
    expect(
      isPoliceDemandsStepValidRC({
        ...validCase,
        requestedValidToDate: '01.01.2024',
      } as Case),
    ).toBe(false)
  })
})

describe('isPoliceDemandsStepValidIC', () => {
  const validCase = {
    demands: 'Kröfur',
    lawsBroken: 'Lagaákvæði',
    legalBasis: 'Lagagrundvöllur',
  } as Case

  test('is true when every field is filled in', () => {
    expect(isPoliceDemandsStepValidIC(validCase)).toBe(true)
  })

  test.each(['demands', 'lawsBroken', 'legalBasis'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(
        isPoliceDemandsStepValidIC({
          ...validCase,
          [field]: undefined,
        } as Case),
      ).toBe(false)
    },
  )
})

describe('isPoliceReportStepValidRC', () => {
  const validCase = {
    demands: 'Kröfur',
    caseFacts: 'Málsatvik',
    legalArguments: 'Lagarök',
  } as Case

  test('is true when every field is filled in', () => {
    expect(isPoliceReportStepValidRC(validCase)).toBe(true)
  })

  test.each(['demands', 'caseFacts', 'legalArguments'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(
        isPoliceReportStepValidRC({ ...validCase, [field]: undefined } as Case),
      ).toBe(false)
    },
  )
})

describe('isPoliceReportStepValidIC', () => {
  const validCase = {
    caseFacts: 'Málsatvik',
    legalArguments: 'Lagarök',
  } as Case

  test('is true when every field is filled in', () => {
    expect(isPoliceReportStepValidIC(validCase)).toBe(true)
  })

  test('does not require demands', () => {
    expect(
      isPoliceReportStepValidIC({ ...validCase, demands: undefined } as Case),
    ).toBe(true)
  })

  test.each(['caseFacts', 'legalArguments'] as const)(
    'is false when %s is missing',
    (field) => {
      expect(
        isPoliceReportStepValidIC({ ...validCase, [field]: undefined } as Case),
      ).toBe(false)
    },
  )
})

describe('isReceptionAndAssignmentStepValid', () => {
  const judge = { id: 'j1' }

  test('requires an R case number for request cases', () => {
    const custody = { type: CaseType.CUSTODY, judge } as Case

    expect(
      isReceptionAndAssignmentStepValid({
        ...custody,
        courtCaseNumber: 'R-1/2024',
      } as Case),
    ).toBe(true)
    expect(
      isReceptionAndAssignmentStepValid({
        ...custody,
        courtCaseNumber: 'S-1/2024',
      } as Case),
    ).toBe(false)
  })

  test('requires an S case number for indictment cases', () => {
    const indictment = { type: CaseType.INDICTMENT, judge } as Case

    expect(
      isReceptionAndAssignmentStepValid({
        ...indictment,
        courtCaseNumber: 'S-1/2024',
      } as Case),
    ).toBe(true)
    expect(
      isReceptionAndAssignmentStepValid({
        ...indictment,
        courtCaseNumber: 'R-1/2024',
      } as Case),
    ).toBe(false)
  })

  test('is false without a judge', () => {
    expect(
      isReceptionAndAssignmentStepValid({
        type: CaseType.CUSTODY,
        courtCaseNumber: 'R-1/2024',
      } as Case),
    ).toBe(false)
  })

  test('is false without a court case number', () => {
    expect(
      isReceptionAndAssignmentStepValid({
        type: CaseType.CUSTODY,
        judge,
      } as Case),
    ).toBe(false)
  })
})

describe('isCourtHearingArrangemenstStepValidRC', () => {
  const arraignmentDate = { date: ISO_DATE, location: 'Dómsalur 1' } as DateLog

  test('is true when the case has an arraignment date', () => {
    expect(
      isCourtHearingArrangemenstStepValidRC({ arraignmentDate } as Case),
    ).toBe(true)
  })

  test('is false when the arraignment date is missing', () => {
    expect(isCourtHearingArrangemenstStepValidRC({} as Case)).toBe(false)
  })

  test('is false when the arraignment date is not in ISO format', () => {
    expect(
      isCourtHearingArrangemenstStepValidRC({
        arraignmentDate: { date: '01.01.2024' },
      } as Case),
    ).toBe(false)
  })

  test('prefers the updated arraignment date over the persisted one', () => {
    expect(
      isCourtHearingArrangemenstStepValidRC({} as Case, arraignmentDate),
    ).toBe(true)
    expect(
      isCourtHearingArrangemenstStepValidRC(
        { arraignmentDate } as Case,
        {
          date: undefined,
        } as DateLog,
      ),
    ).toBe(false)
  })

  test('is false when the defender contact details are malformed', () => {
    expect(
      isCourtHearingArrangemenstStepValidRC({
        arraignmentDate,
        defenderEmail: 'nope',
      } as Case),
    ).toBe(false)
    expect(
      isCourtHearingArrangemenstStepValidRC({
        arraignmentDate,
        defenderPhoneNumber: '1',
      } as Case),
    ).toBe(false)
  })
})

describe('isCourtHearingArrangementsStepValidIC', () => {
  const arraignmentDate = { date: ISO_DATE, location: 'Dómsalur 1' } as DateLog
  const validCase = {
    sessionArrangements: SessionArrangements.ALL_PRESENT,
    arraignmentDate,
  } as Case

  test('is true for a complete case', () => {
    expect(isCourtHearingArrangementsStepValidIC(validCase)).toBe(true)
  })

  test('is false without session arrangements', () => {
    expect(
      isCourtHearingArrangementsStepValidIC({
        ...validCase,
        sessionArrangements: undefined,
      } as Case),
    ).toBe(false)
  })

  test('is false without an arraignment date', () => {
    expect(
      isCourtHearingArrangementsStepValidIC({
        ...validCase,
        arraignmentDate: undefined,
      } as Case),
    ).toBe(false)
  })

  test('prefers the updated arraignment date over the persisted one', () => {
    expect(
      isCourtHearingArrangementsStepValidIC(
        { ...validCase, arraignmentDate: undefined } as Case,
        arraignmentDate,
      ),
    ).toBe(true)
    expect(
      isCourtHearingArrangementsStepValidIC(validCase, {
        date: undefined,
      } as DateLog),
    ).toBe(false)
  })

  test('is false when the defender email is malformed', () => {
    expect(
      isCourtHearingArrangementsStepValidIC({
        ...validCase,
        defenderEmail: 'nope',
      } as Case),
    ).toBe(false)
  })
})

describe('isRulingValidRC', () => {
  const validCase = {
    prosecutorDemands: 'Dómkröfur',
    courtCaseFacts: 'Málsatvik',
    courtLegalArguments: 'Lagarök',
  } as Case

  test('is true when every field is filled in', () => {
    expect(isRulingValidRC(validCase)).toBe(true)
  })

  test.each([
    'prosecutorDemands',
    'courtCaseFacts',
    'courtLegalArguments',
  ] as const)('is false when %s is missing', (field) => {
    expect(isRulingValidRC({ ...validCase, [field]: undefined } as Case)).toBe(
      false,
    )
  })
})

describe('isRulingValidIC', () => {
  const validCase = {
    prosecutorDemands: 'Dómkröfur',
    courtCaseFacts: 'Málsatvik',
    courtLegalArguments: 'Lagarök',
  } as Case

  test('is true when every field is filled in', () => {
    expect(isRulingValidIC(validCase)).toBe(true)
  })

  test.each([
    'prosecutorDemands',
    'courtCaseFacts',
    'courtLegalArguments',
  ] as const)('is false when %s is missing', (field) => {
    expect(isRulingValidIC({ ...validCase, [field]: undefined } as Case)).toBe(
      false,
    )
  })

  test('is true when the case is completed without a ruling', () => {
    expect(isRulingValidIC({ isCompletedWithoutRuling: true } as Case)).toBe(
      true,
    )
  })
})

const caseLevelAppealDecisions = [
  {
    partyRole: AppealDecisionPartyRole.DEFENDANT,
    decision: CaseAppealDecision.ACCEPT,
  },
  {
    partyRole: AppealDecisionPartyRole.PROSECUTOR,
    decision: CaseAppealDecision.APPEAL,
  },
]

describe('isCourtRecordStepValidRC', () => {
  const validCase = {
    appealDecisions: caseLevelAppealDecisions,
    courtStartDate: ISO_DATE,
    courtLocation: 'Dómsalur 1',
    sessionBookings: 'Bókanir',
    courtEndTime: ISO_DATE,
    decision: CaseDecision.ACCEPTING,
    conclusion: 'Úrskurðarorð',
    ruling: 'Úrskurður',
  } as Case

  test('is true for a complete court record', () => {
    expect(isCourtRecordStepValidRC(validCase)).toBe(true)
  })

  test.each([
    'courtStartDate',
    'courtLocation',
    'sessionBookings',
    'courtEndTime',
    'decision',
    'conclusion',
    'ruling',
  ] as const)('is false when %s is missing', (field) => {
    expect(
      isCourtRecordStepValidRC({ ...validCase, [field]: undefined } as Case),
    ).toBe(false)
  })

  test.each([
    AppealDecisionPartyRole.DEFENDANT,
    AppealDecisionPartyRole.PROSECUTOR,
  ])('is false when the %s has no appeal decision', (partyRole) => {
    const workingCase = {
      ...validCase,
      appealDecisions: caseLevelAppealDecisions.filter(
        (decision) => decision.partyRole !== partyRole,
      ),
    } as Case

    expect(isCourtRecordStepValidRC(workingCase)).toBe(false)
  })

  test('ignores appeal decisions that belong to a ruling order', () => {
    const workingCase = {
      ...validCase,
      appealDecisions: caseLevelAppealDecisions.map((decision) => ({
        ...decision,
        rulingFileId: 'ruling-1',
      })),
    } as Case

    expect(isCourtRecordStepValidRC(workingCase)).toBe(false)
  })
})

describe('isCourtRecordStepValidIC', () => {
  const validCase = {
    appealDecisions: caseLevelAppealDecisions,
    sessionArrangements: SessionArrangements.ALL_PRESENT,
    courtStartDate: ISO_DATE,
    courtLocation: 'Dómsalur 1',
    sessionBookings: 'Bókanir',
    courtEndTime: ISO_DATE,
    decision: CaseDecision.ACCEPTING,
    conclusion: 'Úrskurðarorð',
    ruling: 'Úrskurður',
  } as Case

  test('is true for a complete court record', () => {
    expect(isCourtRecordStepValidIC(validCase)).toBe(true)
  })

  test.each([
    'courtStartDate',
    'courtLocation',
    'sessionBookings',
    'courtEndTime',
    'decision',
    'conclusion',
    'ruling',
  ] as const)('is false when %s is missing', (field) => {
    expect(
      isCourtRecordStepValidIC({ ...validCase, [field]: undefined } as Case),
    ).toBe(false)
  })

  test('does not require session bookings when nobody is present', () => {
    expect(
      isCourtRecordStepValidIC({
        ...validCase,
        sessionArrangements: SessionArrangements.NONE_PRESENT,
        sessionBookings: undefined,
      } as Case),
    ).toBe(true)
  })

  test('does not require a conclusion or ruling when completed without a ruling', () => {
    expect(
      isCourtRecordStepValidIC({
        ...validCase,
        isCompletedWithoutRuling: true,
        conclusion: undefined,
        ruling: undefined,
      } as Case),
    ).toBe(true)
  })

  test.each([
    AppealDecisionPartyRole.DEFENDANT,
    AppealDecisionPartyRole.PROSECUTOR,
  ])('is false when the %s has no appeal decision', (partyRole) => {
    const workingCase = {
      ...validCase,
      appealDecisions: caseLevelAppealDecisions.filter(
        (decision) => decision.partyRole !== partyRole,
      ),
    } as Case

    expect(isCourtRecordStepValidIC(workingCase)).toBe(false)
  })
})

describe('isDefenderStepValid', () => {
  const validCase = {
    prosecutor: { id: 'p1' },
    defendants: [{ id: 'd1', defenderChoice: DefenderChoice.WAIVE }],
  } as Case

  test('is false without a prosecutor', () => {
    expect(
      isDefenderStepValid({ ...validCase, prosecutor: undefined } as Case),
    ).toBe(false)
  })

  test.each([[], undefined])(
    'is false when the defendants are %j',
    (defendants) => {
      expect(isDefenderStepValid({ ...validCase, defendants } as Case)).toBe(
        false,
      )
    },
  )

  test.each([
    DefenderChoice.WAIVE,
    DefenderChoice.DELAY,
    DefenderChoice.DELEGATE,
    undefined,
  ])('does not require defender details when the choice is %s', (choice) => {
    expect(
      isDefenderStepValid({
        ...validCase,
        defendants: [{ id: 'd1', defenderChoice: choice }],
      } as Case),
    ).toBe(true)
  })

  describe('when the defendant chooses a defender', () => {
    const chosen = (defendant: Partial<Defendant>) =>
      ({
        ...validCase,
        defendants: [
          {
            id: 'd1',
            defenderChoice: DefenderChoice.CHOOSE,
            defenderName: 'Verjandi',
            ...defendant,
          },
        ],
      } as Case)

    test('is true with a name and well formed contact details', () => {
      expect(
        isDefenderStepValid(
          chosen({
            defenderEmail: 'verjandi@dummy.dd',
            defenderPhoneNumber: '555-5555',
          }),
        ),
      ).toBe(true)
    })

    test('is true with a name only', () => {
      expect(isDefenderStepValid(chosen({}))).toBe(true)
    })

    test('is false without a name', () => {
      expect(isDefenderStepValid(chosen({ defenderName: undefined }))).toBe(
        false,
      )
    })

    test('is false when the contact details are malformed', () => {
      expect(isDefenderStepValid(chosen({ defenderEmail: 'nope' }))).toBe(false)
      expect(isDefenderStepValid(chosen({ defenderPhoneNumber: '1' }))).toBe(
        false,
      )
    })

    test('validates every defendant', () => {
      const workingCase = {
        ...validCase,
        defendants: [
          { id: 'd1', defenderChoice: DefenderChoice.WAIVE },
          { id: 'd2', defenderChoice: DefenderChoice.CHOOSE },
        ],
      } as Case

      expect(isDefenderStepValid(workingCase)).toBe(false)
    })
  })
})

describe('isCourtSessionValid', () => {
  const workingCase = { defendants: [{ id: 'd1' }] } as Case

  const validSession = {
    id: 'cs1',
    startDate: ISO_DATE,
    location: 'Dómsalur 1',
    judgeId: 'j1',
    entries: 'Bókanir',
    rulingType: CourtSessionRulingType.NONE,
    endDate: ISO_DATE,
  } as CourtSessionResponse

  test('is valid for a complete open session without a ruling', () => {
    expect(isCourtSessionValid(validSession, workingCase)).toBeTruthy()
  })

  test.each([
    'startDate',
    'location',
    'judgeId',
    'entries',
    'rulingType',
    'endDate',
  ] as const)('is invalid when %s is missing', (field) => {
    expect(
      isCourtSessionValid(
        { ...validSession, [field]: undefined } as CourtSessionResponse,
        workingCase,
      ),
    ).toBeFalsy()
  })

  test('requires legal provisions when the session is closed', () => {
    const closed = { ...validSession, isClosed: true } as CourtSessionResponse

    expect(isCourtSessionValid(closed, workingCase)).toBeFalsy()
    expect(
      isCourtSessionValid(
        {
          ...closed,
          closedLegalProvisions: [{}],
        } as CourtSessionResponse,
        workingCase,
      ),
    ).toBeTruthy()
  })

  test.each([
    CourtSessionRulingType.JUDGEMENT,
    CourtSessionRulingType.DISMISSAL_ORDER,
  ])('requires a ruling when the ruling type is %s', (rulingType) => {
    const session = { ...validSession, rulingType } as CourtSessionResponse

    expect(isCourtSessionValid(session, workingCase)).toBeFalsy()
    expect(
      isCourtSessionValid(
        { ...session, ruling: 'Dómsorð' } as CourtSessionResponse,
        workingCase,
      ),
    ).toBeTruthy()
  })

  describe('when the ruling type is an order', () => {
    const rulingFileId = 'ruling-1'
    const order = {
      ...validSession,
      rulingType: CourtSessionRulingType.ORDER,
      ruling: 'Úrskurðarorð',
      rulingFileId,
    } as CourtSessionResponse

    const decidedCase = {
      ...workingCase,
      appealDecisions: [
        {
          rulingFileId,
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          decision: CaseAppealDecision.ACCEPT,
        },
        {
          rulingFileId,
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'd1',
          decision: CaseAppealDecision.APPEAL,
        },
      ],
    } as Case

    test('is valid once every party has decided on the ruling', () => {
      expect(isCourtSessionValid(order, decidedCase)).toBeTruthy()
    })

    test('is invalid without a ruling', () => {
      expect(
        isCourtSessionValid(
          { ...order, ruling: undefined } as CourtSessionResponse,
          decidedCase,
        ),
      ).toBeFalsy()
    })

    test('is invalid without a ruling file', () => {
      expect(
        isCourtSessionValid(
          { ...order, rulingFileId: undefined } as CourtSessionResponse,
          decidedCase,
        ),
      ).toBeFalsy()
    })

    test('is invalid while a party has not decided on the ruling', () => {
      expect(isCourtSessionValid(order, workingCase)).toBeFalsy()
    })
  })

  test('requires an attesting witness when one is recorded', () => {
    const withWitness = {
      ...validSession,
      isAttestingWitness: true,
    } as CourtSessionResponse

    expect(isCourtSessionValid(withWitness, workingCase)).toBeFalsy()
    expect(
      isCourtSessionValid(
        { ...withWitness, attestingWitnessId: 'w1' } as CourtSessionResponse,
        workingCase,
      ),
    ).toBeTruthy()
  })

  test('requires entries for every merged case with documents', () => {
    const withMergedDocument = {
      ...validSession,
      filedDocuments: [{ id: 'doc1', mergedFromCaseId: 'merged-1' }],
    } as CourtSessionResponse

    expect(isCourtSessionValid(withMergedDocument, workingCase)).toBeFalsy()
    expect(
      isCourtSessionValid(
        {
          ...withMergedDocument,
          courtSessionStrings: [
            {
              id: 's1',
              mergedCaseId: 'merged-1',
              stringType: CourtSessionStringType.ENTRIES,
              value: 'Bókanir sameinaðs máls',
            },
          ],
        } as CourtSessionResponse,
        workingCase,
      ),
    ).toBeTruthy()
  })
})

describe('isGeneratedIndictmentCourtRecordValid', () => {
  test('is true when every court session is confirmed', () => {
    expect(
      isGeneratedIndictmentCourtRecordValid({
        courtSessions: [{ isConfirmed: true }, { isConfirmed: true }],
      } as Case),
    ).toBe(true)
  })

  test('is false when a court session is unconfirmed', () => {
    expect(
      isGeneratedIndictmentCourtRecordValid({
        courtSessions: [{ isConfirmed: true }, { isConfirmed: false }],
      } as Case),
    ).toBe(false)
  })

  test.each([[], undefined])(
    'is false when the court sessions are %j',
    (courtSessions) => {
      expect(
        isGeneratedIndictmentCourtRecordValid({ courtSessions } as Case),
      ).toBe(false)
    },
  )
})

describe('isNoGeneratedIndictmentCourtRecord', () => {
  test.each([[], undefined, null])(
    'is true when the court sessions are %j',
    (courtSessions) => {
      expect(
        isNoGeneratedIndictmentCourtRecord({ courtSessions } as Case),
      ).toBe(true)
    },
  )

  test('is false when there is a court session', () => {
    expect(
      isNoGeneratedIndictmentCourtRecord({
        courtSessions: [{ id: 'cs1' }],
      } as Case),
    ).toBe(false)
  })
})

describe('isConclusionStepValid', () => {
  test('requires an explanation when postponing indefinitely', () => {
    const postponing = {
      indictmentDecision: IndictmentDecision.POSTPONING,
    } as Case

    expect(isConclusionStepValid(postponing)).toBe(false)
    expect(
      isConclusionStepValid({
        ...postponing,
        postponedIndefinitelyExplanation: 'Skýring',
      } as Case),
    ).toBe(true)
  })

  test('requires a court session type and date when scheduling', () => {
    const scheduling = {
      indictmentDecision: IndictmentDecision.SCHEDULING,
      courtSessionType: CourtSessionType.MAIN_HEARING,
      courtDate: { date: ISO_DATE },
    } as Case

    expect(isConclusionStepValid(scheduling)).toBe(true)
    expect(
      isConclusionStepValid({
        ...scheduling,
        courtSessionType: undefined,
      } as Case),
    ).toBe(false)
    expect(
      isConclusionStepValid({ ...scheduling, courtDate: undefined } as Case),
    ).toBe(false)
  })

  test.each([
    IndictmentDecision.POSTPONING_UNTIL_VERDICT,
    IndictmentDecision.REDISTRIBUTING,
  ])('is true when the decision is %s', (indictmentDecision) => {
    expect(isConclusionStepValid({ indictmentDecision } as Case)).toBe(true)
  })

  test.each([
    undefined,
    IndictmentDecision.COMPLETING_FOR_SOME,
    IndictmentDecision.SPLITTING,
  ])('is false when the decision is %s', (indictmentDecision) => {
    expect(isConclusionStepValid({ indictmentDecision } as Case)).toBe(false)
  })

  describe('when completing', () => {
    const courtRecordFile = {
      id: 'court-record',
      category: CaseFileCategory.COURT_RECORD,
    }
    const rulingFile = { id: 'ruling', category: CaseFileCategory.RULING }
    const confirmedSession = { id: 'cs1', isConfirmed: true }
    const unconfirmedSession = { id: 'cs2', isConfirmed: false }

    const completing = (workingCase: Partial<Case>) =>
      ({
        indictmentDecision: IndictmentDecision.COMPLETING,
        ...workingCase,
      } as Case)

    test('is false without a ruling decision', () => {
      expect(isConclusionStepValid(completing({}))).toBe(false)
    })

    test('is false for a withdrawal', () => {
      expect(
        isConclusionStepValid(
          completing({
            indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
            caseFiles: [courtRecordFile, rulingFile],
          }),
        ),
      ).toBe(false)
    })

    test.each([
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.DISMISSAL,
    ])(
      'requires an uploaded court record and ruling for %s',
      (indictmentRulingDecision) => {
        expect(
          isConclusionStepValid(
            completing({
              indictmentRulingDecision,
              caseFiles: [courtRecordFile, rulingFile],
            }),
          ),
        ).toBe(true)
        expect(
          isConclusionStepValid(
            completing({ indictmentRulingDecision, caseFiles: [rulingFile] }),
          ),
        ).toBe(false)
        expect(
          isConclusionStepValid(
            completing({
              indictmentRulingDecision,
              caseFiles: [courtRecordFile],
            }),
          ),
        ).toBe(false)
      },
    )

    test('requires confirmed court sessions instead of an uploaded court record when the court record is generated', () => {
      const ruling = {
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        withCourtSessions: true,
        caseFiles: [rulingFile],
      }

      expect(
        isConclusionStepValid(
          completing({ ...ruling, courtSessions: [confirmedSession] }),
        ),
      ).toBe(true)
      expect(
        isConclusionStepValid(
          completing({ ...ruling, courtSessions: [unconfirmedSession] }),
        ),
      ).toBe(false)
      expect(
        isConclusionStepValid(
          completing({
            ...ruling,
            caseFiles: [courtRecordFile, rulingFile],
            courtSessions: [],
          }),
        ),
      ).toBe(false)
    })

    test.each([
      CaseIndictmentRulingDecision.FINE,
      CaseIndictmentRulingDecision.CANCELLATION,
    ])('requires only a court record for %s', (indictmentRulingDecision) => {
      expect(
        isConclusionStepValid(
          completing({
            indictmentRulingDecision,
            caseFiles: [courtRecordFile],
          }),
        ),
      ).toBe(true)
      expect(
        isConclusionStepValid(
          completing({ indictmentRulingDecision, caseFiles: [] }),
        ),
      ).toBe(false)
    })

    describe('when merging', () => {
      const merging = (workingCase: Partial<Case>) =>
        completing({
          indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
          ...workingCase,
        })

      test('is true with a selected merge case and no court record', () => {
        expect(
          isConclusionStepValid(merging({ mergeCase: { id: 'merge-1' } })),
        ).toBe(true)
      })

      test('accepts a well formed merge case number instead of a selected case', () => {
        expect(
          isConclusionStepValid(merging({ mergeCaseNumber: 'S-1/2024' })),
        ).toBe(true)
        expect(
          isConclusionStepValid(merging({ mergeCaseNumber: 'R-1/2024' })),
        ).toBe(false)
      })

      test('is false without a merge case or merge case number', () => {
        expect(isConclusionStepValid(merging({}))).toBe(false)
      })

      test('requires a generated court record to be confirmed when one exists', () => {
        const withSessions = {
          mergeCase: { id: 'merge-1' },
          withCourtSessions: true,
        }

        expect(
          isConclusionStepValid(
            merging({ ...withSessions, courtSessions: [confirmedSession] }),
          ),
        ).toBe(true)
        expect(
          isConclusionStepValid(
            merging({ ...withSessions, courtSessions: [unconfirmedSession] }),
          ),
        ).toBe(false)
      })
    })
  })
})

describe('isAdminUserFormValid', () => {
  const validUser = {
    id: 'u1',
    institution: { id: 'i1' },
    role: UserRole.PROSECUTOR,
    nationalId: NATIONAL_ID,
    name: 'Notandi',
    title: 'Saksóknari',
    mobileNumber: '555-5555',
    email: 'notandi@dummy.dd',
  } as User

  test('is true for a complete user', () => {
    expect(isAdminUserFormValid(validUser)).toBe(true)
  })

  test.each([
    'institution',
    'role',
    'nationalId',
    'name',
    'title',
    'mobileNumber',
    'email',
  ] as const)('is false when %s is missing', (field) => {
    expect(
      isAdminUserFormValid({ ...validUser, [field]: undefined } as User),
    ).toBe(false)
  })

  test('is false when the national id is malformed', () => {
    expect(
      isAdminUserFormValid({ ...validUser, nationalId: '0101' } as User),
    ).toBe(false)
  })

  test('is false when the email is malformed', () => {
    expect(isAdminUserFormValid({ ...validUser, email: 'nope' } as User)).toBe(
      false,
    )
  })
})

describe('isCourtOfAppealCaseStepValid', () => {
  const validAppealCase = {
    appealState: AppealCaseState.RECEIVED,
    appealCaseNumber: '1/2024',
    appealJudge1: { id: 'j1' },
    appealJudge2: { id: 'j2' },
    appealJudge3: { id: 'j3' },
    appealAssistant: { id: 'a1' },
  } as AppealCase

  test('is true when the judges, assistant and case number are registered', () => {
    expect(isCourtOfAppealCaseStepValid(validAppealCase)).toBe(true)
  })

  test.each([
    'appealJudge1',
    'appealJudge2',
    'appealJudge3',
    'appealAssistant',
  ] as const)('is false when %s is missing', (field) => {
    expect(
      isCourtOfAppealCaseStepValid({
        ...validAppealCase,
        [field]: undefined,
      } as AppealCase),
    ).toBe(false)
  })

  test('does not require judges or an assistant when the appeal is withdrawn', () => {
    expect(
      isCourtOfAppealCaseStepValid({
        appealState: AppealCaseState.WITHDRAWN,
        appealCaseNumber: '1/2024',
      } as AppealCase),
    ).toBe(true)
  })

  test('is false when the appeal case number is missing or malformed', () => {
    expect(
      isCourtOfAppealCaseStepValid({
        ...validAppealCase,
        appealCaseNumber: undefined,
      } as AppealCase),
    ).toBe(false)
    expect(
      isCourtOfAppealCaseStepValid({
        ...validAppealCase,
        appealCaseNumber: '12345/2024',
      } as AppealCase),
    ).toBe(false)
  })

  test.each([undefined, null])(
    'is false when the appeal case is %s',
    (appealCase) => {
      expect(isCourtOfAppealCaseStepValid(appealCase)).toBe(false)
    },
  )
})

describe('isCourtOfAppealRulingStepFieldsValid', () => {
  test('is false without a ruling decision', () => {
    expect(isCourtOfAppealRulingStepFieldsValid({} as AppealCase)).toBe(false)
    expect(isCourtOfAppealRulingStepFieldsValid(undefined)).toBe(false)
  })

  test('requires a conclusion for a ruling decision', () => {
    const accepting = {
      appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    } as AppealCase

    expect(isCourtOfAppealRulingStepFieldsValid(accepting)).toBe(false)
    expect(
      isCourtOfAppealRulingStepFieldsValid({
        ...accepting,
        appealConclusion: 'Niðurstaða',
      } as AppealCase),
    ).toBe(true)
  })

  test('does not require a conclusion when the appeal was discontinued', () => {
    expect(
      isCourtOfAppealRulingStepFieldsValid({
        appealRulingDecision: AppealCaseRulingDecision.DISCONTINUED,
      } as AppealCase),
    ).toBe(true)
  })
})

describe('isCourtOfAppealWithdrawnCaseStepValid', () => {
  test('is true with a well formed appeal case number', () => {
    expect(
      isCourtOfAppealWithdrawnCaseStepValid({
        appealCase: { appealCaseNumber: '1/2024' },
      } as Case),
    ).toBe(true)
  })

  test('is false without an appeal case', () => {
    expect(isCourtOfAppealWithdrawnCaseStepValid({} as Case)).toBe(false)
  })

  test('is false when the appeal case number is malformed', () => {
    expect(
      isCourtOfAppealWithdrawnCaseStepValid({
        appealCase: { appealCaseNumber: 'A-1/2024' },
      } as Case),
    ).toBe(false)
  })
})

describe('isNullOrUndefined', () => {
  test.each([null, undefined])('is true for %s', (value) => {
    expect(isNullOrUndefined(value)).toBe(true)
  })

  test.each([0, '', false, [], {}])('is false for %j', (value) => {
    expect(isNullOrUndefined(value)).toBe(false)
  })
})
