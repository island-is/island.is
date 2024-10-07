import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { isDefendantInfoActionButtonDisabled } from './Overview'

describe('Overview', () => {
  describe('isDefendantInfoActionButtonDisabled', () => {
    test('should return true if defendant service requirement is REQUIRED and defendant vervidictViewDate is not null', () => {
      const verdictViewDate = '2024-07-08'
      const serviceRequirement = ServiceRequirement.REQUIRED

      const res = isDefendantInfoActionButtonDisabled({
        id: 'id',
        verdictViewDate,
        serviceRequirement,
      })

      expect(res).toEqual(true)
    })

    test('should return true if defendant service requirement is REQUIRED and defendant vervidictViewDate is null', () => {
      const verdictViewDate = null
      const serviceRequirement = ServiceRequirement.REQUIRED

      const res = isDefendantInfoActionButtonDisabled({
        id: 'id',
        verdictViewDate,
        serviceRequirement,
      })

      expect(res).toEqual(false)
    })

    test('should return true if defendant service requirement is NOT_APPLICABLE and defendant vervidictViewDate is not null', () => {
      const verdictViewDate = '2024-07-09'
      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const res = isDefendantInfoActionButtonDisabled({
        id: 'id',
        verdictViewDate,
        serviceRequirement,
      })

      expect(res).toEqual(true)
    })

    test('should return true if defendant service requirement is NOT_APPLICABLE and defendant vervidictViewDate is null', () => {
      const verdictViewDate = null
      const serviceRequirement = ServiceRequirement.NOT_APPLICABLE

      const res = isDefendantInfoActionButtonDisabled({
        id: 'id',
        verdictViewDate,
        serviceRequirement,
      })

      expect(res).toEqual(false)
    })

    test('should return true if defendant service requirement is NOT_REQUIRED', () => {
      const verdictViewDate = null
      const serviceRequirement = ServiceRequirement.NOT_REQUIRED

      const res = isDefendantInfoActionButtonDisabled({
        id: 'id',
        verdictViewDate,
        serviceRequirement,
      })

      expect(res).toEqual(true)
    })
  })
})
