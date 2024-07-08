import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { getAppealExpirationInfo } from './DefendantInfo'

describe('DefendantInfo', () => {
  describe('getAdditionalDataSections', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-07-08'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    test('should return the correct string if viewDate is not provided', () => {
      const viewDate = undefined
      const serviceRequirement = ServiceRequirement.NOT_REQUIRED

      const dataSections = getAppealExpirationInfo(viewDate, serviceRequirement)

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_not_begun',
      )
    })

    test('should return the correct string if serviceRequirement is NOT_REQUIRED', () => {
      const viewDate = '2024-07-08'
      const serviceRequirement = ServiceRequirement.NOT_REQUIRED

      const dataSections = getAppealExpirationInfo(viewDate, serviceRequirement)

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.service_requirement_not_required',
      )
    })

    test('should return the correct string if serviceRequirement is NOT_APPLICABLE', () => {
      const viewDate = '2024-07-08'
      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const dataSections = getAppealExpirationInfo(viewDate, serviceRequirement)

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.service_requirement_not_applicable',
      )
    })

    test('should return the correct string if appeal expiration date is in the future', () => {
      const viewDate = '2024-07-08'
      const serviceRequirement = ServiceRequirement.REQUIRED

      const dataSections = getAppealExpirationInfo(viewDate, serviceRequirement)

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_expiration_date',
      )
      expect(dataSections.data).toStrictEqual('5.08.2024')
    })

    test('should return the correct string if appeal expiration date is in the past', () => {
      const viewDate = '2024-06-09'
      const serviceRequirement = ServiceRequirement.REQUIRED

      const dataSections = getAppealExpirationInfo(viewDate, serviceRequirement)

      expect(dataSections.message.id).toStrictEqual(
        'judicial.system.core:info_card.defendant_info.appeal_date_expired',
      )
      expect(dataSections.data).toStrictEqual('7.07.2024')
    })
  })
})
