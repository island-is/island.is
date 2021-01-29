import { ServiceId } from '../../gen/fetch/xrd-rest'
import {
  serviceIdSort,
  SortOrder,
  parseVersionNumber,
  parseServiceCode,
} from './utils'

const serviceId1: ServiceId = { serviceCode: 'thjodskra-v1' }
const serviceId2: ServiceId = { serviceCode: 'thjodskra-v2' }

describe('Utils', () => {
  describe('serviceIdSort', () => {
    describe('sorts correctly using ascending order', () => {
      it('should returned negative value when a < b', () => {
        expect(
          serviceIdSort(serviceId1, serviceId2, SortOrder.ASC),
        ).toBeLessThan(0)
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

    describe('sorts correctly using descending order', () => {
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

  describe('parseVersionNumber', () => {
    test.each`
      serviceCode              | expected
      ${'petstore'}            | ${'petstore'}
      ${'petstore-v1'}         | ${'v1'}
      ${'amazing-petstore-v1'} | ${'v1'}
      ${'petstore-v1.0'}       | ${'v1.0'}
      ${'petstore-v1.1.0'}     | ${'v1.1.0'}
      ${'petstore-v10.1.1'}    | ${'v10.1.1'}
      ${'petstore-v10.10.1'}   | ${'v10.10.1'}
      ${'petstore-v10.10.10'}  | ${'v10.10.10'}
    `('returns $expected for $serviceCode', ({ serviceCode, expected }) => {
      expect(parseVersionNumber(serviceCode)).toBe(expected)
    })
  })

  describe('parseServiceCode', () => {
    test.each`
      serviceCode              | expected
      ${'petstore'}            | ${'petstore'}
      ${'petstore-v1'}         | ${'petstore'}
      ${'amazing-petstore-v1'} | ${'amazing-petstore'}
      ${'petstore-v1.0'}       | ${'petstore'}
      ${'petstore-v1.1.0'}     | ${'petstore'}
    `('returns $expected for $serviceCode', ({ serviceCode, expected }) => {
      expect(parseServiceCode(serviceCode)).toBe(expected)
    })
  })
})
