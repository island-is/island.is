import {
  AppealDecisionPartyRole,
  Case,
  CaseAppealDecision,
  CourtSessionResponse,
  DateLog,
  Defendant,
  IndictmentCount,
  IndictmentCountOffense,
  IndictmentSubtype,
  SubpoenaType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  areAppealDecisionsComplete,
  getIndictmentCountWarningMessage,
  isIndictmentCountComplete,
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
    const workingCase = { defendants: [alternativeServiceDefendant] } as Case

    expect(
      isSubpoenaStepValid(
        workingCase,
        [alternativeServiceDefendant],
        null,
        true,
      ),
    ).toBe(true)
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
    } as Case

    expect(isSubpoenaStepValid(workingCase)).toBe(false)
  })
})
