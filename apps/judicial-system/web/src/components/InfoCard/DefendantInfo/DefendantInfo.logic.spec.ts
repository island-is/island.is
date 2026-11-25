import faker from 'faker'

import type { InstitutionUser } from '@island.is/judicial-system/types'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getAppealExpirationInfo,
  getDefendantTagConfig,
  getInfoCardDefender,
  prefersAppealDefenderOnInfoCard,
} from './DefendantInfo.logic'
import { strings } from './DefendantInfo.strings'

const defendantName = faker.name.findName()
const defenderName = faker.name.findName()
const appealDefenderName = faker.name.findName()
const defenderEmail = faker.internet.email()
const appealDefenderEmail = faker.internet.email()
const defenderPhoneNumber = faker.phone.phoneNumber()
const appealDefenderPhoneNumber = faker.phone.phoneNumber()

const defendantWith = (overrides: Partial<Defendant>): Defendant =>
  ({
    id: 'defendant-id',
    name: defendantName,
    ...overrides,
  } as Defendant)

const userWith = (
  role: UserRole,
  institutionType: InstitutionType,
): InstitutionUser =>
  ({
    role,
    institution: { type: institutionType },
  } as InstitutionUser)

describe('DefendantInfo', () => {
  describe('getAdditionalDataSections', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-07-08'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    test('should return the correct string if serviceRequirement is REQUIRED and verdictAppealDeadline is not provided', () => {
      const verdictAppealDeadline = undefined
      const isVerdictAppealDeadlineExpired = false
      const serviceRequirement = ServiceRequirement.REQUIRED

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(strings.appealDateNotBegun)
    })

    test('should return the correct string if serviceRequirement is NOT_APPLICABLE and verdictAppealDeadline is not provided', () => {
      const verdictAppealDeadline = undefined
      const isVerdictAppealDeadlineExpired = false

      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(strings.appealDateNotBegun)
    })

    test('should return the correct string if serviceRequirement is NOT_REQUIRED', () => {
      const verdictAppealDeadline = undefined
      const isVerdictAppealDeadlineExpired = false
      const serviceRequirement = ServiceRequirement.NOT_REQUIRED

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(strings.serviceNotRequired)
    })

    test('should return the correct string if serviceRequirement is REQUIRED and appeal expiration date is in the future', () => {
      const verdictAppealDeadline = '2024-08-05'
      const isVerdictAppealDeadlineExpired = false
      const serviceRequirement = ServiceRequirement.REQUIRED

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(
        strings.appealExpirationDate,
      )
      expect(dataSections.date).toStrictEqual('05.08.2024')
    })

    test('should return the correct string if serviceRequirement is NOT_APPLICABLE and appeal expiration date is in the future', () => {
      const verdictAppealDeadline = '2024-08-05'
      const isVerdictAppealDeadlineExpired = false
      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(
        strings.appealExpirationDate,
      )
      expect(dataSections.date).toStrictEqual('05.08.2024')
    })

    test('should return the correct string if serviceRequirement is REQUIRED and appeal expiration date is in the past', () => {
      const verdictAppealDeadline = '2024-07-07'
      const isVerdictAppealDeadlineExpired = true
      const serviceRequirement = ServiceRequirement.REQUIRED

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(strings.appealDateExpired)
      expect(dataSections.date).toStrictEqual('07.07.2024')
    })

    test('should return the correct string if serviceRequirement is NOT_APPLICABLE and appeal expiration date is in the past', () => {
      const verdictAppealDeadline = '2024-07-07'
      const isVerdictAppealDeadlineExpired = true
      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const dataSections = getAppealExpirationInfo({
        verdictAppealDeadline,
        isVerdictAppealDeadlineExpired,
        serviceRequirement,
      })

      expect(dataSections.message.id).toStrictEqual(strings.appealDateExpired)
      expect(dataSections.date).toStrictEqual('07.07.2024')
    })
  })

  describe('getDefendantTagConfig', () => {
    test('should return closed without enforcement tag for public prosecution users, even when a verdict exists', () => {
      const tag = getDefendantTagConfig({
        verdict: {
          isAcquittedByPublicProsecutionOffice: true,
          defendantHasRequestedAppeal: true,
          isDefaultJudgement: true,
        },
        isPublicProsecutionOffice: true,
        isClosedWithoutEnforcement: true,
      })

      expect(tag).toStrictEqual({
        key: 'closedWithoutEnforcement',
        label: 'Lokið',
        variant: 'rose',
      })
    })

    test('should not return closed without enforcement tag for non-public prosecution users', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        isClosedWithoutEnforcement: true,
      })

      expect(tag).toBeNull()
    })

    test('should return acquitted tag for public prosecution users', () => {
      const tag = getDefendantTagConfig({
        verdict: {
          isAcquittedByPublicProsecutionOffice: true,
          defendantHasRequestedAppeal: true,
          isDefaultJudgement: true,
        },
        isPublicProsecutionOffice: true,
      })

      expect(tag).toStrictEqual({
        key: 'acquitted',
        label: 'Sýknudómur',
        variant: 'darkerBlue',
      })
    })

    test('should return appeal requested tag for public prosecution users', () => {
      const tag = getDefendantTagConfig({
        verdict: {
          isAcquittedByPublicProsecutionOffice: false,
          defendantHasRequestedAppeal: true,
          isDefaultJudgement: true,
        },
        isPublicProsecutionOffice: true,
      })

      expect(tag).toStrictEqual({
        key: 'appealRequested',
        label: 'Áfrýjunarleyfi',
        variant: 'darkerBlue',
      })
    })

    test('should return default judgement tag for non-public prosecution users', () => {
      const tag = getDefendantTagConfig({
        verdict: {
          isAcquittedByPublicProsecutionOffice: true,
          defendantHasRequestedAppeal: true,
          isDefaultJudgement: true,
        },
        isPublicProsecutionOffice: false,
      })

      expect(tag).toStrictEqual({
        key: 'defaultJudgement',
        label: 'Útivistardómur',
        variant: 'purple',
      })
    })

    test('should return verdict tag when verdict exists and no prior verdict statuses match', () => {
      const tag = getDefendantTagConfig({
        verdict: {
          isAcquittedByPublicProsecutionOffice: false,
          defendantHasRequestedAppeal: false,
          isDefaultJudgement: false,
        },
        isPublicProsecutionOffice: false,
      })

      expect(tag).toStrictEqual({
        key: 'verdict',
        label: 'Dómur',
        variant: 'darkerBlue',
      })
    })

    test('should return dismissal tag when there is no verdict and ruling decision is DISMISSAL', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      })

      expect(tag).toStrictEqual({
        label: 'Frávísun',
        variant: 'blue',
      })
    })

    test('should return cancellation tag when there is no verdict and ruling decision is CANCELLATION', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      })

      expect(tag).toStrictEqual({
        label: 'Niðurfelling',
        variant: 'rose',
      })
    })

    test('should return fine tag when there is no verdict and ruling decision is FINE', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      })

      expect(tag).toStrictEqual({
        label: 'Viðurlagaákvörðun',
        variant: 'mint',
      })
    })

    test('should return withdrawal tag when there is no verdict and ruling decision is WITHDRAWAL', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      })

      expect(tag).toStrictEqual({
        label: 'Afturkallað',
        variant: 'rose',
      })
    })

    test('should return merge tag when there is no verdict and ruling decision is MERGE', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
      })

      expect(tag).toStrictEqual({
        label: 'Sameinað',
        variant: 'rose',
      })
    })

    test('should return null when no statuses match', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
      })

      expect(tag).toBeNull()
    })
  })

  describe('getInfoCardDefender', () => {
    const defendant = defendantWith({
      defenderName,
      defenderEmail,
      defenderPhoneNumber,
      appealDefenderName,
      appealDefenderEmail,
      appealDefenderPhoneNumber,
    })

    test('prefers the appeal defender for court of appeals users', () => {
      expect(
        getInfoCardDefender(defendant, {
          user: userWith(
            UserRole.COURT_OF_APPEALS_JUDGE,
            InstitutionType.COURT_OF_APPEALS,
          ),
        }),
      ).toEqual({
        name: appealDefenderName,
        email: appealDefenderEmail,
        phoneNumber: appealDefenderPhoneNumber,
      })
    })

    test('prefers the appeal defender for public prosecution office staff', () => {
      expect(
        getInfoCardDefender(defendant, {
          user: userWith(
            UserRole.PUBLIC_PROSECUTOR_STAFF,
            InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
          ),
        }).name,
      ).toBe(appealDefenderName)
    })

    test('prefers the appeal defender for public prosecutors', () => {
      expect(
        getInfoCardDefender(defendant, {
          user: userWith(
            UserRole.PROSECUTOR,
            InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
          ),
        }).name,
      ).toBe(appealDefenderName)
    })

    test('keeps the district-court defender for other roles', () => {
      expect(
        getInfoCardDefender(defendant, {
          user: userWith(
            UserRole.DISTRICT_COURT_JUDGE,
            InstitutionType.DISTRICT_COURT,
          ),
        }),
      ).toEqual({
        name: defenderName,
        email: defenderEmail,
        phoneNumber: defenderPhoneNumber,
      })
    })

    test('falls back to the district-court defender when no appeal defender is set', () => {
      expect(
        getInfoCardDefender(
          defendantWith({
            defenderName,
            defenderEmail,
          }),
          {
            user: userWith(
              UserRole.COURT_OF_APPEALS_JUDGE,
              InstitutionType.COURT_OF_APPEALS,
            ),
          },
        ).name,
      ).toBe(defenderName)
    })
  })

  describe('prefersAppealDefenderOnInfoCard', () => {
    test('is true for the appeal-facing roles and false otherwise', () => {
      expect(
        prefersAppealDefenderOnInfoCard(
          userWith(
            UserRole.COURT_OF_APPEALS_ASSISTANT,
            InstitutionType.COURT_OF_APPEALS,
          ),
        ),
      ).toBe(true)
      expect(
        prefersAppealDefenderOnInfoCard(
          userWith(
            UserRole.PROSECUTOR,
            InstitutionType.POLICE_PROSECUTORS_OFFICE,
          ),
        ),
      ).toBe(false)
    })
  })
})
