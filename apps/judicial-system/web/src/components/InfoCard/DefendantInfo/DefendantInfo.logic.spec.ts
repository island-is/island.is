import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { getAppealExpirationInfo } from './DefendantInfo.logic'

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
})
