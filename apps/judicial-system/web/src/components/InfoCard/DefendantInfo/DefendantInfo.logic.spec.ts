import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getAppealExpirationInfo,
  getDefendantTagConfig,
} from './DefendantInfo.logic'

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

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_not_begun_v2',
      )
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

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_not_begun_v2',
      )
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

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.service_not_required',
      )
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
        'judicial.system.core:info_card.defendant_info.appeal_expiration_date_v2',
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
        'judicial.system.core:info_card.defendant_info.appeal_expiration_date_v2',
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

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_expired_v2',
      )
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

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_expired_v2',
      )
      expect(dataSections.date).toStrictEqual('07.07.2024')
    })
  })

  describe('getDefendantTagConfig', () => {
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

    test('should return dismissal tag when there is no verdict and dismissal case is true', () => {
      const tag = getDefendantTagConfig({
        verdict: null,
        isPublicProsecutionOffice: false,
        isDismissalCase: true,
        isCancellationCase: true,
        isFineCase: true,
      })

      expect(tag).toStrictEqual({
        label: 'Frávísun',
        variant: 'blue',
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
})
