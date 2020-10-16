import { Test } from '@nestjs/testing'
import { ServiceId } from '../../gen/fetch/xrd-rest'
import { serviceIdSort, SortOrder } from './utils'

const serviceId1: ServiceId = { serviceCode: 'thjodskra-v1' }
const serviceId2: ServiceId = { serviceCode: 'thjodskra-v2' }

describe('Utils', () => {
  describe('serviceIdSort using ascending order', () => {
    it('should returned negative value when a < b', () => {
      expect(serviceIdSort(serviceId1, serviceId2, SortOrder.ASC)).toBeLessThan(
        0,
      )
    })

    it('should return positive value when a > b', () => {
      expect(
        serviceIdSort(serviceId2, serviceId1, SortOrder.ASC),
      ).toBeGreaterThan(0)
    })

    it('should return 0 when a == b', () => {
      expect(serviceIdSort(serviceId1, serviceId1, SortOrder.ASC)).toEqual(0)
    })
  })

  describe('serviceIdSort using descending order', () => {
    it('should returned positive value when a < b', () => {
      expect(
        serviceIdSort(serviceId1, serviceId2, SortOrder.DESC),
      ).toBeGreaterThan(0)
    })

    it('should return negative value when a > b', () => {
      expect(
        serviceIdSort(serviceId2, serviceId1, SortOrder.DESC),
      ).toBeLessThan(0)
    })

    it('should return 0 when a == b', () => {
      expect(serviceIdSort(serviceId1, serviceId1, SortOrder.DESC)).toEqual(0)
    })
  })
})
